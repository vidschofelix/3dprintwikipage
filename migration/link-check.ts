/**
 * Link/asset checker for the generated docs.
 *
 * VitePress already errors on dead page links during `docs:build`. This script
 * focuses on what the build does NOT catch:
 *   1. Image references (`![…](/images/…)` or `[…](/images/…)`) whose target
 *      file is missing from `docs/public/images/`.
 *   2. Image files in `docs/public/images/` that no page references — useful
 *      for trimming the bundle.
 *
 * Returns exit code 1 if any missing references are found, so CI can gate on
 * it. Orphan images are reported but do not fail the run.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = process.cwd();
const DOCS = path.join(ROOT, "docs");
const PUBLIC_IMAGES = path.join(DOCS, "public", "images");

function walkMd(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".vitepress" || entry.name === "public") continue;
      walkMd(abs, out);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(abs);
    }
  }
  return out;
}

function walkAll(dir: string, base = dir, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walkAll(abs, base, out);
    else if (entry.isFile())
      out.push(path.relative(base, abs).split(path.sep).join("/"));
  }
  return out;
}

// Image refs only: anything starting with `/images/`.
// Match markdown image `![alt](path)` AND plain link `[label](path)` because
// the converter routes non-image media (zip, pdf, …) through the plain-link
// form but still under `/images/`.
const IMG_REF_RE = /!?\[[^\]]*\]\((\/images\/[^)\s#?]+)/g;

function stripCodeFences(md: string): string {
  // Drop fenced code blocks so we don't false-positive on URLs inside them.
  return md.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
}

type Miss = { file: string; ref: string };

function main() {
  if (!fs.existsSync(PUBLIC_IMAGES)) {
    console.error(
      `docs/public/images/ does not exist. Run \`pnpm migrate:images\` first.`,
    );
    process.exit(1);
  }

  const mdFiles = walkMd(DOCS);
  const imagesOnDisk = new Set(walkAll(PUBLIC_IMAGES));

  const referenced = new Set<string>();
  const missing: Miss[] = [];

  for (const file of mdFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const text = stripCodeFences(raw);
    for (const m of text.matchAll(IMG_REF_RE)) {
      const ref = m[1]; // e.g. /images/foo/bar.png
      const rel = ref.replace(/^\/images\//, "");
      referenced.add(rel);
      if (!imagesOnDisk.has(rel)) {
        missing.push({ file: path.relative(ROOT, file), ref });
      }
    }
  }

  const orphans = [...imagesOnDisk].filter((r) => !referenced.has(r)).sort();

  console.log(`Scanned ${mdFiles.length} markdown files.`);
  console.log(
    `Image files on disk: ${imagesOnDisk.size}, referenced: ${referenced.size}, missing: ${missing.length}, orphans: ${orphans.length}`,
  );

  if (missing.length > 0) {
    console.log("\nMissing image references:");
    for (const m of missing) console.log(`  ${m.file}  ->  ${m.ref}`);
  }

  if (orphans.length > 0) {
    console.log("\nOrphan images (in docs/public/images/ but never linked):");
    for (const o of orphans) console.log(`  ${o}`);
  }

  process.exit(missing.length > 0 ? 1 : 0);
}

main();
