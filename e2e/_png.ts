import { inflateSync } from "node:zlib";

/**
 * Enough of a PNG reader to answer one question: is this baseline a picture of
 * anything?
 *
 * Playwright bundles pngjs, but only at `playwright-core/lib/utilsBundle` —
 * a private path with no types that a minor upgrade may move. Chromium writes
 * every screenshot as 8-bit truecolour, non-interlaced, so the decode is a
 * header check, one inflate and the five scanline filters. Anything else
 * throws rather than being guessed at.
 */
export type Decoded = { width: number; height: number; pixels: Buffer };

const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

export function decodePng(buffer: Buffer): Decoded {
  if (!buffer.subarray(0, 8).equals(SIGNATURE)) throw new Error("not a PNG");

  let width = 0;
  let height = 0;
  let channels = 0;
  const deflated: Buffer[] = [];

  for (let at = 8; at + 8 <= buffer.length; ) {
    const length = buffer.readUInt32BE(at);
    const type = buffer.toString("ascii", at + 4, at + 8);
    const body = buffer.subarray(at + 8, at + 8 + length);
    at += 12 + length; // length + type + data + CRC

    if (type === "IHDR") {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      const [depth, colour, , , interlace] = [body[8], body[9], body[10], body[11], body[12]];
      if (depth !== 8 || interlace !== 0 || (colour !== 2 && colour !== 6)) {
        throw new Error(
          `unsupported PNG (depth ${depth}, colour type ${colour}, interlace ${interlace})`,
        );
      }
      channels = colour === 2 ? 3 : 4;
    } else if (type === "IDAT") {
      deflated.push(body);
    } else if (type === "IEND") {
      break;
    }
  }

  if (!channels) throw new Error("PNG has no IHDR");

  const raw = inflateSync(Buffer.concat(deflated));
  const stride = width * channels;
  const pixels = Buffer.alloc(stride * height);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const out = y * stride;
    const above = out - stride;

    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? pixels[out + x - channels] : 0;
      const up = y > 0 ? pixels[above + x] : 0;
      const upLeft = y > 0 && x >= channels ? pixels[above + x - channels] : 0;
      let value = line[x];
      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += (left + up) >> 1;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const dl = Math.abs(p - left);
        const du = Math.abs(p - up);
        const dul = Math.abs(p - upLeft);
        value += dl <= du && dl <= dul ? left : du <= dul ? up : upLeft;
      } else if (filter !== 0) {
        throw new Error(`unknown scanline filter ${filter} on row ${y}`);
      }
      pixels[out + x] = value & 0xff;
    }
  }

  return { width, height, pixels: Buffer.from(pixels.subarray(0, stride * height)) };
}

/**
 * How much of the frame is not the background.
 *
 * `ink` is an absolute pixel count, not a fraction: an element capture is as
 * wide as the viewport but its content is not, so a ratio reports the same
 * render as thinner at 1920 than at 320. The background is taken to be the
 * commonest colour, which is what it is in every one of these captures.
 */
export function inkOf(decoded: Decoded): { colours: number; ink: number } {
  const { width, height, pixels } = decoded;
  const channels = pixels.length / (width * height);
  const counts = new Map<number, number>();

  for (let i = 0; i < pixels.length; i += channels) {
    const key = (pixels[i] << 16) | (pixels[i + 1] << 8) | pixels[i + 2];
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  let commonest = 0;
  for (const count of counts.values()) if (count > commonest) commonest = count;
  return { colours: counts.size, ink: width * height - commonest };
}
