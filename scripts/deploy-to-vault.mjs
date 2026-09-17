#!/usr/bin/env node
/**
 * Copy the built plugin (main.js, manifest.json, styles.css) into an Obsidian
 * vault's plugin folder. Run `npm run build` first.
 *
 * Usage:
 *   npm run deploy                      # default vault below
 *   npm run deploy -- <plugin-dir>      # explicit target
 *   OBSIDIAN_PLUGIN_DIR=<dir> npm run deploy
 *
 * After copying, reload the plugin in Obsidian (toggle it off/on or restart).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_TARGET = "C:\\Users\\Gleb\\Obsidian\\Tablet\\.obsidian\\plugins\\copilot";
const FILES = ["main.js", "manifest.json", "styles.css"];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = process.argv[2] || process.env.OBSIDIAN_PLUGIN_DIR || DEFAULT_TARGET;

const missing = FILES.filter((f) => !fs.existsSync(path.join(root, f)));
if (missing.length > 0) {
  console.error(`Missing build output: ${missing.join(", ")}. Run \`npm run build\` first.`);
  process.exit(1);
}

if (!fs.existsSync(target)) {
  console.error(`Target folder does not exist: ${target}`);
  process.exit(1);
}

for (const file of FILES) {
  fs.copyFileSync(path.join(root, file), path.join(target, file));
  console.log(`copied ${file}`);
}
console.log(`Deployed to ${target}. Reload the plugin in Obsidian.`);
