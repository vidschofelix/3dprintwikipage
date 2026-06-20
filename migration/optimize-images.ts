/**
 * Image migration & optimization for 3DPrint.Wiki.
 *
 * Walks `backup/data/data/media/` recursively. For each file:
 *   - JPG / JPEG / PNG -> piped through `sharp`, resized to fit within
 *     `MAX_WIDTH` x `MAX_HEIGHT` (only downscales, never upscales), re-encoded
 *     with sensible defaults (mozjpeg q82 progressive / png compressionLevel 9
 *     with palette where possible).
 *   - Everything else (gif, svg, ico, pdf, zip, xlsx, etc.) -> straight copy.
 *
 * Output lands in `docs/public/images/<original-relative-path>` so that
 * markdown references of the form `![alt](/images/ns/foo.jpg)` (the form
 * emitted by `convert.ts`) resolve at build time.
 *
 * Idempotent: skips files whose target already exists and is newer than the
 * source. Pass `--force` to re-process everything.
 *
 * Run via `pnpm migrate:images`.
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "backup/data/data/media");
const OUT_DIR = path.join(ROOT, "docs/public/images");

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const JPEG_QUALITY = 82;

const RASTER_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const COPY_EXTS = new Set([".gif", ".svg", ".ico", ".pdf", ".zip", ".xlsx", ".webp"]);

const FORCE = process.argv.includes("--force");

interface Stats {
  optimized: number;
  copied: number;
  skipped: number;
  unknown: number;
  errors: number;
  bytesIn: number;
  bytesOut: number;
}

async function walk(dir: string, out: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

async function shouldSkip(src: string, dest: string): Promise<boolean> {
  if (FORCE) return false;
  try {
    const [srcStat, destStat] = await Promise.all([fs.stat(src), fs.stat(dest)]);
    return destStat.mtimeMs >= srcStat.mtimeMs;
  } catch {
    return false;
  }
}

async function optimizeRaster(src: string, dest: string, ext: string): Promise<{ in: number; out: number }> {
  const input = sharp(src, { failOn: "none" });
  const meta = await input.metadata();
  const needsResize =
    (meta.width ?? 0) > MAX_WIDTH || (meta.height ?? 0) > MAX_HEIGHT;

  let pipeline = input.rotate(); // honour EXIF orientation, then drop it
  if (needsResize) {
    pipeline = pipeline.resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else {
    // .jpg / .jpeg
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });
  }

  await fs.mkdir(path.dirname(dest), { recursive: true });
  const buffer = await pipeline.toBuffer();
  await fs.writeFile(dest, buffer);

  const srcStat = await fs.stat(src);
  return { in: srcStat.size, out: buffer.length };
}

async function copyFile(src: string, dest: string): Promise<{ in: number; out: number }> {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
  const s = await fs.stat(src);
  return { in: s.size, out: s.size };
}

function humanBytes(n: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 100 ? 0 : 1)} ${units[i]}`;
}

async function main(): Promise<void> {
  const files = await walk(SRC_DIR);
  const stats: Stats = {
    optimized: 0,
    copied: 0,
    skipped: 0,
    unknown: 0,
    errors: 0,
    bytesIn: 0,
    bytesOut: 0,
  };

  for (const src of files) {
    const rel = path.relative(SRC_DIR, src);
    const dest = path.join(OUT_DIR, rel);
    const ext = path.extname(src).toLowerCase();

    try {
      if (await shouldSkip(src, dest)) {
        stats.skipped += 1;
        continue;
      }

      if (RASTER_EXTS.has(ext)) {
        const r = await optimizeRaster(src, dest, ext === ".jpeg" ? ".jpg" : ext);
        stats.optimized += 1;
        stats.bytesIn += r.in;
        stats.bytesOut += r.out;
      } else if (COPY_EXTS.has(ext)) {
        const r = await copyFile(src, dest);
        stats.copied += 1;
        stats.bytesIn += r.in;
        stats.bytesOut += r.out;
      } else {
        // Unknown extension: copy as-is and warn, rather than silently dropping.
        const r = await copyFile(src, dest);
        stats.unknown += 1;
        stats.bytesIn += r.in;
        stats.bytesOut += r.out;
        console.warn(`  ? unknown extension, copied: ${rel}`);
      }
    } catch (err) {
      stats.errors += 1;
      console.error(`  ! ${rel}: ${(err as Error).message}`);
    }
  }

  console.log("");
  console.log("Image migration complete:");
  console.log(`  optimized : ${stats.optimized}`);
  console.log(`  copied    : ${stats.copied}`);
  console.log(`  unknown   : ${stats.unknown}`);
  console.log(`  skipped   : ${stats.skipped}`);
  console.log(`  errors    : ${stats.errors}`);
  if (stats.bytesIn > 0) {
    const ratio = stats.bytesOut / stats.bytesIn;
    console.log(
      `  size      : ${humanBytes(stats.bytesIn)} -> ${humanBytes(stats.bytesOut)} (${(ratio * 100).toFixed(1)}%)`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
