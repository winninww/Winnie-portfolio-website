const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const projectRoot = process.argv[2] || process.cwd();
const dataPath = path.join(projectRoot, "src", "data", "portfolio-data.json");
const uploadsDir = path.join(projectRoot, "public", "uploads");

const mimeToExtension = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"]
]);

function parseDataUrl(value) {
  const match = /^data:([^;,]+)(;base64)?,(.*)$/s.exec(value);
  if (!match) return null;

  const mime = match[1].toLowerCase();
  const extension = mimeToExtension.get(mime);
  if (!extension) return null;

  const buffer = match[2] ? Buffer.from(match[3], "base64") : Buffer.from(decodeURIComponent(match[3]), "utf8");
  return { buffer, extension };
}

function writeUploadFile(dataUrl) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return dataUrl;

  const hash = crypto.createHash("sha256").update(parsed.buffer).digest("hex").slice(0, 16);
  const filename = `portfolio-${hash}.${parsed.extension}`;
  const absolutePath = path.join(uploadsDir, filename);
  fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(absolutePath)) {
    fs.writeFileSync(absolutePath, parsed.buffer);
  }
  return `/uploads/${filename}`;
}

function walk(value, stats) {
  if (typeof value === "string") {
    if (!value.startsWith("data:image/")) return value;
    stats.extracted += 1;
    return writeUploadFile(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => walk(item, stats));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, walk(item, stats)]));
  }

  return value;
}

const raw = fs.readFileSync(dataPath, "utf8");
const stats = { extracted: 0 };
const migrated = walk(JSON.parse(raw), stats);
fs.writeFileSync(dataPath, `${JSON.stringify(migrated, null, 2)}\n`, "utf8");

console.log(`Extracted ${stats.extracted} image data URL(s) into ${uploadsDir}`);
