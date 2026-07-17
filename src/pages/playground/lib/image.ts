import type { AttachedImage } from "../types";

const MAX_EDGE = 1568; // Anthropic downscales larger images anyway
const JPEG_QUALITY = 0.85;
const MAX_SOURCE_BYTES = 12 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

// Downscale to <=1568px on the long edge and re-encode so the base64 payload
// stays small (cost + request size). GIF/WebP with transparency fall back to
// PNG; everything else re-encodes to JPEG.
export async function fileToAttachedImage(file: File): Promise<AttachedImage> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Unsupported image type");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("Image is too large (max 12MB)");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const outType = file.type === "image/png" || file.type === "image/gif" ? "image/png" : "image/jpeg";
  const dataUrl = canvas.toDataURL(outType, JPEG_QUALITY);
  const data = dataUrl.slice(dataUrl.indexOf(",") + 1);

  return { mediaType: outType, data, previewUrl: dataUrl };
}
