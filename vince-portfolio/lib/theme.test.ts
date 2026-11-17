import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { THEME_COLOR, THEME_INIT_SCRIPT, TOKEN_NAMES, getTheme, readToken, setTheme, toggleTheme } from "./theme";

const tokensCss = readFileSync(fileURLToPath(new URL("../styles/tokens.css", import.meta.url)), "utf8");

/** Body of the first rule whose selector list starts with `selector`. */
function block(selector: string): string {
  const start = tokensCss.indexOf(selector);
  expect(start, `${selector} block in tokens.css`).toBeGreaterThanOrEqual(0);
  const open = tokensCss.indexOf("{", start);
  return tokensCss.slice(open + 1, tokensCss.indexOf("}", open));
}
const DARK = block(":root,\n:root[data-theme=\"dark\"]");
const LIGHT = block(":root[data-theme=\"light\"]");
const value = (body: string, name: string) => body.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();

/** Minimal DOM stand-in: <html> attributes, one theme-color meta, localStorage. */
function fakeDom(stored: string | null, opts: { throwOnStorage?: boolean } = {}) {
  const attrs: Record<string, string> = {};
  const meta = { content: "#0D0D0D", setAttribute(_: string, v: string) { this.content = v; } };
  const store = new Map<string, string>(stored === null ? [] : [["theme", stored]]);
  const documentElement = {
    dataset: new Proxy({} as Record<string, string>, {
      set: (_t, k, v) => ((attrs[`data-${String(k)}`] = v), true),
      get: (_t, k) => attrs[`data-${String(k)}`],
    }),
    setAttribute: (k: string, v: string) => void (attrs[k] = v),
    getAttribute: (k: string) => attrs[k] ?? null,
    classList: { add: vi.fn(), remove: vi.fn() },
  };
  const document = { documentElement, querySelector: () => meta };
  const localStorage = {
    getItem: (k: string) => {
      if (opts.throwOnStorage) throw new Error("blocked");
      return store.get(k) ?? null;
    },
    setItem: (k: string, v: string) => {
      if (opts.throwOnStorage) throw new Error("blocked");
      store.set(k, v);
    },
  };
  return { attrs, meta, store, document, localStorage };
}

describe("THEME_INIT_SCRIPT", () => {
  const run = (dom: ReturnType<typeof fakeDom>) =>
    new Function("document", "localStorage", THEME_INIT_SCRIPT)(dom.document, dom.localStorage);

  it.each([
    [null, "dark", "#0D0D0D"],
    ["dark", "dark", "#0D0D0D"],
    ["light", "light", "#FAFAFA"],
    ["purple", "dark", "#0D0D0D"],
  ])("stored %s → data-theme %s, meta %s", (stored, theme, color) => {
    const dom = fakeDom(stored);
    run(dom);
    expect(dom.attrs["data-theme"]).toBe(theme);
    expect(dom.meta.content).toBe(color);
  });

  it("never throws when storage is blocked", () => {
    const dom = fakeDom("light", { throwOnStorage: true });
    expect(() => run(dom)).not.toThrow();
  });

  it("hardcodes the same colours as THEME_COLOR and tokens.css --bg", () => {
    expect(THEME_INIT_SCRIPT).toContain(THEME_COLOR.light);
    expect(THEME_INIT_SCRIPT).toContain(THEME_COLOR.dark);
    expect(value(DARK, "bg")).toBe(THEME_COLOR.dark);
    expect(value(LIGHT, "bg")).toBe(THEME_COLOR.light);
  });
});

describe("theme API without a DOM", () => {
  it("getTheme is dark and readToken is empty on the server", () => {
    expect(getTheme()).toBe("dark");
    expect(readToken("bg")).toBe("");
  });
});

describe("setTheme", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("applies immediately when View Transitions are unavailable", () => {
    const dom = fakeDom("dark");
    vi.stubGlobal("document", dom.document);
    vi.stubGlobal("localStorage", dom.localStorage);
    setTheme("light");
    expect(dom.attrs["data-theme"]).toBe("light");
    expect(dom.store.get("theme")).toBe("light");
    expect(dom.meta.content).toBe("#FAFAFA");
    toggleTheme();
    expect(dom.attrs["data-theme"]).toBe("dark");
    expect(dom.meta.content).toBe("#0D0D0D");
  });

  it("still applies when storage is blocked", () => {
    const dom = fakeDom("dark", { throwOnStorage: true });
    vi.stubGlobal("document", dom.document);
    vi.stubGlobal("localStorage", dom.localStorage);
    setTheme("light");
    expect(dom.attrs["data-theme"]).toBe("light");
  });
});

describe("tokens.css", () => {
  it("defines every TokenName in both the dark and the light block", () => {
    for (const name of TOKEN_NAMES) {
      expect(value(DARK, name), `dark --${name}`).toBeTruthy();
      expect(value(LIGHT, name), `light --${name}`).toBeTruthy();
    }
  });

  it("keeps illustration tokens as 6-digit hex (read by canvas / Three.js)", () => {
    const illustration = TOKEN_NAMES.filter((n) => /^(device|scene|logo)-/.test(n));
    for (const name of illustration) {
      expect(value(DARK, name)).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(value(LIGHT, name)).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});
