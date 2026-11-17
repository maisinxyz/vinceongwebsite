"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getTheme,
  readToken,
  setTheme,
  subscribeTheme,
  toggleTheme,
  type Theme,
  type TokenName,
} from "@/lib/theme";

const getServerTheme = (): Theme => "dark";

export function useTheme(): { theme: Theme; setTheme: typeof setTheme; toggleTheme: typeof toggleTheme } {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  return { theme, setTheme, toggleTheme };
}

/* Snapshots are cached per name list and theme, so the returned object keeps
   the same identity until the theme changes (safe in dependency arrays). */
type TokenRecord = Readonly<Record<string, string>>;
const clientCache = new Map<string, { theme: Theme; value: TokenRecord }>();
const serverCache = new Map<string, TokenRecord>();
const pendingCache = new Map<string, { theme: Theme; value: TokenRecord }>();

const shallowEqual = (a: TokenRecord, b: TokenRecord) => Object.keys(a).every((k) => a[k] === b[k]);

function readTokens(key: string): TokenRecord {
  const theme = getTheme();
  const hit = clientCache.get(key);
  if (hit && hit.theme === theme) return hit.value;
  const value: Record<string, string> = {};
  for (const name of key.split(",")) value[name] = readToken(name as TokenName);
  const frozen = Object.freeze(value);
  // Only cache complete reads: an empty value means the stylesheet has not applied
  // yet, and caching it would pin blank tokens for this theme for the session.
  if (Object.values(frozen).every((v) => v !== "")) {
    clientCache.set(key, { theme, value: frozen });
    return frozen;
  }
  // Keep identity stable across repeated incomplete reads (useSyncExternalStore
  // requires getSnapshot to return the same object while nothing changed).
  const pending = pendingCache.get(key);
  if (pending && pending.theme === theme && shallowEqual(pending.value, frozen)) return pending.value;
  pendingCache.set(key, { theme, value: frozen });
  return frozen;
}

function emptyTokens(key: string): TokenRecord {
  let value = serverCache.get(key);
  if (!value) {
    value = Object.freeze(Object.fromEntries(key.split(",").map((name) => [name, ""])));
    serverCache.set(key, value);
  }
  return value;
}

/**
 * Current values of the given tokens, re-read when the theme changes.
 * Server render and hydration see empty strings; heavy canvas/R3F consumers are
 * client-only (ssr:false), so they get real values on their first render.
 */
export function useThemeTokens<const K extends TokenName>(names: readonly K[]): Readonly<Record<K, string>> {
  const key = names.join(",");
  const getSnapshot = useCallback(() => readTokens(key), [key]);
  const getServerSnapshot = useCallback(() => emptyTokens(key), [key]);
  return useSyncExternalStore(subscribeTheme, getSnapshot, getServerSnapshot) as Readonly<Record<K, string>>;
}
