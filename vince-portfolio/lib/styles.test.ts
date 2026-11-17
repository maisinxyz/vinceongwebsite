import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Unlayered CSS outranks Tailwind's @layer utilities, so an unlayered rule that sets
// margin or padding on `*` or a bare element silently kills p-* / m-* utilities
// site-wide (CONTRACT 1.9). This keeps such a rule from coming back. Print-only rules are exempt.
const root = fileURLToPath(new URL("..", import.meta.url));
const files = ["app/globals.css", ...readdirSync(`${root}styles`).filter((f) => f.endsWith(".css")).map((f) => `styles/${f}`)];

const BARE = ["html", "body", "h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "li", "a", "button", "input", "section", "main", "div"];
const GUTTER_COPIES = [".pl-gutter", ".ml-gutter", ".-ml-gutter", ".pt-nav-top", ".pb-navbar"];

/** Removes comments and every `@<name> … { … }` block for the given at-rule names. */
function strip(css: string, atRules: string[]): string {
  let out = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const name of atRules) {
    for (let at = out.indexOf(`@${name}`); at !== -1; at = out.indexOf(`@${name}`)) {
      const open = out.indexOf("{", at);
      const semi = out.indexOf(";", at);
      if (open === -1 || (semi !== -1 && semi < open)) { out = out.slice(0, at) + out.slice(semi + 1); continue; }
      let depth = 1, i = open + 1;
      for (; depth > 0 && i < out.length; i++) depth += out[i] === "{" ? 1 : out[i] === "}" ? -1 : 0;
      out = out.slice(0, at) + out.slice(i);
    }
  }
  return out;
}

/** Flat `selector { declarations }` pairs; @media and similar wrappers are unwrapped. */
function rules(css: string): { selector: string; body: string }[] {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].replace(/@[^{]*$/, "").trim(), body: m[2] }));
}

describe("no unlayered spacing reset", () => {
  for (const file of files) {
    const unlayered = rules(strip(readFileSync(root + file, "utf8"), ["layer", "utility", "theme", "keyframes", "import", "media print"]));

    it(`${file}: no margin/padding on * or bare elements`, () => {
      const bad = unlayered.filter(({ selector, body }) => {
        if (!/(^|[;\s])(margin|padding)(-[a-z-]+)?\s*:/.test(body)) return false;
        const hit = selector.split(",").map((s) => s.trim()).some((s) => s === "*" || BARE.includes(s));
        const allowed = selector === "body" && body.trim().replace(/;$/, "") === "padding-bottom: var(--nav-bar-bottom)";
        return hit && !allowed;
      });
      expect(bad.map((r) => r.selector)).toEqual([]);
    });

    it(`${file}: no unlayered gutter utility copies`, () => {
      const bad = unlayered.filter(({ selector }) => selector.split(",").some((s) => GUTTER_COPIES.includes(s.trim())));
      expect(bad.map((r) => r.selector)).toEqual([]);
    });
  }
});
