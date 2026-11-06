// Checks every locale against locales/en.js: same keys, same array lengths, same {placeholders}
// and the same HTML tags in every string. Usage: node check-locales.js [code...]
const fs = require("fs");
const path = require("path");

const en = require("./locales/en.js");
const codes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(path.join(__dirname, "locales")).map(f => f.replace(/\.js$/, "")).filter(c => c !== "en");

const placeholders = s => (s.match(/\{\w+\}/g) || []).sort().join(",");
const tags = s => (s.match(/<\/?[a-z]+/g) || []).join(",");

let failed = false;
for (const code of codes) {
  const errors = [];
  let loc;
  try { loc = require("./locales/" + code + ".js"); } catch (e) { errors.push("does not load: " + e.message); }
  const walk = (a, b, at) => {
    if (typeof a === "string") {
      if (typeof b !== "string") return errors.push(at + ": expected a string");
      if (a && !b.trim()) errors.push(at + ": empty");
      if (placeholders(a) !== placeholders(b)) errors.push(at + ": placeholders differ (" + placeholders(a) + " vs " + placeholders(b) + ")");
      if (tags(a) !== tags(b)) errors.push(at + ": HTML tags differ (" + tags(a) + " vs " + tags(b) + ")");
      return;
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return errors.push(at + ": expected an array of " + a.length);
      return a.forEach((x, i) => walk(x, b[i], at + "[" + i + "]"));
    }
    if (!b || typeof b !== "object") return errors.push(at + ": expected an object");
    for (const k of Object.keys(a)) {
      if (!(k in b)) errors.push(at + "." + k + ": missing");
      else walk(a[k], b[k], at + "." + k);
    }
    for (const k of Object.keys(b)) if (!(k in a)) errors.push(at + "." + k + ": not in en.js");
  };
  if (loc) {
    walk(en, loc, code);
    if (loc.dir !== code) errors.push(code + ".dir: should be \"" + code + "\"");
  }
  if (errors.length) { failed = true; console.log("✗ " + code + "\n  " + errors.join("\n  ")); }
  else console.log("✓ " + code);
}
process.exit(failed ? 1 : 0);
