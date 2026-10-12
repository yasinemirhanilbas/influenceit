import { test } from "node:test";
import assert from "node:assert/strict";
import en from "../locales/en.js";
import tr from "../locales/tr.js";

// Lists every key path ("a.b.c"); arrays count as one leaf with their length.
function paths(value, prefix = "") {
  if (Array.isArray(value)) return [`${prefix}[${value.length}]`];
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
  return [prefix];
}

test("English and Turkish have exactly the same keys", () => {
  const a = new Set(paths(en));
  const b = new Set(paths(tr));
  assert.deepEqual([...a].filter((p) => !b.has(p)), [], "missing in tr");
  assert.deepEqual([...b].filter((p) => !a.has(p)), [], "missing in en");
});

test("no empty UI strings", () => {
  const empty = (obj) => paths(obj).filter((p) => { const v = p.split(/[.\[]/).reduce((o, k) => (o == null ? o : o[k.replace("]", "")]), obj); return v === ""; });
  assert.deepEqual(empty(en), []);
  assert.deepEqual(empty(tr), []);
});

test("placeholders like {name} match between languages", () => {
  const tokens = (s) => (String(s).match(/\{\w+\}/g) ?? []).sort().join(",");
  const walk = (a, b, path) => {
    if (typeof a === "string" && typeof b === "string") assert.equal(tokens(a), tokens(b), `placeholder mismatch at ${path}`);
    else if (a && typeof a === "object" && b && typeof b === "object") for (const k of Object.keys(a)) if (k in b) walk(a[k], b[k], `${path}.${k}`);
  };
  walk(en, tr, "");
});
