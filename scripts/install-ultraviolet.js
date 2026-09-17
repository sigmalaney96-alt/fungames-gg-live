import { existsSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "node_modules", "@titaniumnetwork-dev", "ultraviolet", "dist");
const destination = path.join(root, "public", "uv");
const required = ["uv.bundle.js", "uv.client.js", "uv.sw.js", "uv.handler.js"];

function findFile(directory, filename) {
  if (!existsSync(directory)) return null;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isFile() && entry.name === filename) return fullPath;
    if (entry.isDirectory()) {
      const result = findFile(fullPath, filename);
      if (result) return result;
    }
  }
  return null;
}

if (!existsSync(source)) {
  throw new Error(`Ultraviolet package was not installed: ${source}`);
}

mkdirSync(destination, { recursive: true });
for (const filename of required) {
  const sourceFile = findFile(source, filename);
  if (!sourceFile) throw new Error(`Ultraviolet asset is missing: ${filename}`);
  copyFileSync(sourceFile, path.join(destination, filename));
  console.log(`Installed public/uv/${filename}`);
}

console.log("Ultraviolet browser assets installed successfully.");
