import { put } from "@vercel/blob";
import crypto from "crypto";

const mimeToExtension = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"]
]);

function extensionFromMime(mime: string) {
  return mimeToExtension.get(mime.toLowerCase()) ?? "png";
}

function extensionFromFilename(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (extension && ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(extension)) {
    return extension === "jpeg" ? "jpg" : extension;
  }
  return "";
}

export async function saveUploadBuffer(buffer: Buffer, mime: string, originalName = "") {
  const extension = extensionFromFilename(originalName) || extensionFromMime(mime);
  const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const filename = `portfolio-${hash}.${extension}`;

  const blob = await put(
  `portfolio/${filename}`,
  new Blob([new Uint8Array(buffer)], { type: mime }),
  {
    access: "public",
    contentType: mime,
    allowOverwrite: true,
    cacheControlMaxAge: 0
  }
);

  return blob.url;
}

export async function saveDataUrlImage(value: string) {
  const match = /^data:([^;]+);base64,(.[\s\S]*)$/.exec(value);
  if (!match) return value;

  const mime = match[1].toLowerCase();
  if (!mimeToExtension.has(mime)) return value;

  const buffer = Buffer.from(match[2], "base64");
  return saveUploadBuffer(buffer, mime);
}

export async function replaceDataUrlImages<T>(value: T): Promise<T> {
  if (typeof value === "string") {
    if (!value.startsWith("data:image/")) return value;
    return (await saveDataUrlImage(value)) as T;
  }

  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => replaceDataUrlImages(item))) as T;
  }

  if (value && typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value).map(async ([key, item]) => [key, await replaceDataUrlImages(item)] as const)
    );
    return Object.fromEntries(entries) as T;
  }

  return value;
}
