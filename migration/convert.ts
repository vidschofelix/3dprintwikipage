/**
 * DokuWiki → VitePress Markdown converter.
 *
 * Reads:
 *   - backup/data/data/pages/**\/*.txt  (source content)
 *   - migration/triage.md               (single source of truth for per-page actions)
 *
 * Writes:
 *   - docs/<path>.md                    (converted pages, KEEP / KEEP-INDEX / MERGE target / REWRITE not touched here)
 *
 * Skips (DROP-GENERIC / DROP-EMPTY / DROP-DUP / DROP-HISTORICAL) per triage.
 *
 * Run with:  pnpm migrate:convert
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const SRC_ROOT = join(ROOT, "backup/data/data/pages");
const DOCS_ROOT = join(ROOT, "docs");
const TRIAGE = join(ROOT, "migration/triage.md");

// ---------------------------------------------------------------------------
// Triage parser
// ---------------------------------------------------------------------------

type Action =
  | "KEEP"
  | "KEEP-INDEX"
  | "MERGE"
  | "REWRITE"
  | "DROP-GENERIC"
  | "DROP-EMPTY"
  | "DROP-DUP"
  | "DROP-HISTORICAL";

interface TriageEntry {
  source: string; // relative path under pages/, e.g. "reprap/anet/a8.txt"
  action: Action;
  notes: string;
}

async function parseTriage(): Promise<Map<string, TriageEntry>> {
  const text = await readFile(TRIAGE, "utf8");
  const out = new Map<string, TriageEntry>();
  // table rows look like: | `path.txt` | bytes | **ACTION** | notes |
  const rowRe =
    /^\|\s*`([^`]+\.txt)`\s*\|\s*[\d ]+\s*\|\s*\*\*([A-Z-]+)\*\*\s*\|\s*(.*?)\s*\|\s*$/gm;
  for (const m of text.matchAll(rowRe)) {
    const [, source, action, notes] = m;
    out.set(source, { source, action: action as Action, notes });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Path normalization
// ---------------------------------------------------------------------------

/**
 * Map a DokuWiki source path (relative to pages/, .txt) to its target
 * docs/ markdown path (relative, .md). Returns null when the page must
 * not produce its own file (drops, MERGE sources whose content is folded
 * into another file, etc).
 */
function targetPathFor(source: string): string | null {
  // strip .txt
  let p = source.replace(/\.txt$/, "");

  // Path normalizations from triage.md
  p = p.replace(
    /^reprap\/anet\/a8\/improvement\//,
    "reprap/anet/a8/improvements/",
  );
  p = p.replace(/^reprap\/creatility\//, "reprap/creality/");
  p = p.replace(
    /^reprap\/printers\/opensource\//,
    "reprap/opensource/",
  );

  // home.txt under a namespace → that namespace's index.md
  if (p.endsWith("/home")) p = p.replace(/\/home$/, "/index");

  return `${p}.md`;
}

// ---------------------------------------------------------------------------
// DokuWiki ns:path resolution helpers
// ---------------------------------------------------------------------------

/** "reprap:anet:a8" → "reprap/anet/a8" */
function nsToPath(ns: string): string {
  return ns.replace(/^:+/, "").replace(/::+/g, ":").replace(/:/g, "/");
}

/** Title-case a slug for use as link label when none provided. */
function deriveLabel(ns: string): string {
  const last = ns.split(/[:/]/).pop() ?? ns;
  return last
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// ---------------------------------------------------------------------------
// DokuWiki → Markdown
// ---------------------------------------------------------------------------

interface ConvertOpts {
  /** Set of valid internal targets (docs-relative paths without .md). */
  validTargets: Set<string>;
  /** Fuzzy lookup: normalized (lowercase, [\s_-]+ → `_`) → canonical target. */
  fuzzyTargets: Map<string, string>;
  /** Pages folded into another via MERGE: source path (no .txt) → "target#anchor". */
  mergeRedirects: Map<string, string>;
  /** Current page's docs-relative path (without .md), for relative link calc. */
  selfTarget: string;
}

function fuzzyKey(path: string): string {
  // Treat /, _, -, : and whitespace as interchangeable separators.
  return path.toLowerCase().replace(/[\s/_:.-]+/g, "_");
}

/** Heading levels: count `=` and infer 1..6. DokuWiki: more `=` → bigger heading.
 *  We auto-promote so the highest level in the file becomes h1, AND we enforce
 *  the markdown rule "at most one h1 per page" (subsequent same-level headings
 *  demote to h2). */
function transformHeadings(md: string): string {
  // Allow unbalanced opening/closing markers: some source pages use e.g.
  // `=====Title======` (5 vs 6). DokuWiki itself uses the OPENING count for
  // level, so we mirror that and ignore the trailing count.
  const headRe = /^(={2,6})\s*(.+?)\s*=+\s*$/gm;
  const counts: number[] = [];
  for (const m of md.matchAll(headRe)) counts.push(m[1].length);
  if (counts.length === 0) return md;
  const maxEq = Math.max(...counts);
  let h1Used = false;
  return md.replace(headRe, (_, eqs: string, title: string) => {
    let lvl = Math.min(6, Math.max(1, 1 + (maxEq - eqs.length)));
    if (lvl === 1) {
      if (h1Used) lvl = 2;
      else h1Used = true;
    }
    return `${"#".repeat(lvl)} ${title}`;
  });
}

/** Convert DokuWiki inline + block syntax → Markdown. */
function convertDokuwiki(raw: string, opts: ConvertOpts): string {
  let text = raw.replace(/\r\n?/g, "\n");

  // Preserve <code>...</code> and <nowiki>...</nowiki> blocks first.
  const placeholders: string[] = [];
  const stash = (s: string) => {
    const i = placeholders.length;
    placeholders.push(s);
    return `\x00${i}\x00`;
  };
  // `<code [lang]>...</code>` and `<file [lang] [filename]>...</file>` both
  // become fenced code blocks. For `<file>` the first token after the tag name
  // is treated as the language; remaining tokens (typically a filename) are
  // dropped for simplicity. Inline usage like `<file>foo</file>` falls through
  // as a fenced block, which is acceptable here.
  text = text.replace(
    /<(code|file)(?:\s+([^>]*))?>([\s\S]*?)<\/\1>/g,
    (_, _tag: string, attrs: string | undefined, body: string) => {
      const lang = (attrs ?? "").trim().split(/\s+/)[0] ?? "";
      return stash(`\n\`\`\`${lang}\n${body.replace(/^\n/, "")}\n\`\`\`\n`);
    },
  );
  text = text.replace(/<nowiki>([\s\S]*?)<\/nowiki>/g, (_, body) => stash(body));

  // Strip unsupported DokuWiki plugin blocks (e.g. <csv file=...>...</csv>).
  // The CSV plugin renders a remote spreadsheet server-side; we can't replicate
  // that statically, and the unquoted URL attribute breaks Vue's HTML parser.
  // Other relevant DokuWiki content (links to the same sheet) is already
  // present in the source above the csv block in every observed instance.
  text = text.replace(/<csv\b[^>]*>[\s\S]*?<\/csv>/gi, "");

  // Headings (do early so later rules can't accidentally hit them).
  text = transformHeadings(text);

  // Media embeds: `{{ :ns:foo.ext?params|caption }}`.
  // Image extensions become `![caption](/images/...)`; everything else (zip,
  // pdf, xlsx, ...) becomes a regular `[caption](/images/...)` link so Vite
  // doesn't try to resolve a non-image file as a Markdown image import.
  // Tolerates whitespace around the optional ?params and |caption segments.
  const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico"]);
  text = text.replace(
    /\{\{\s*:?([^\s|}?]+)(?:\?[^|}]*)?\s*(?:\|\s*([^}]*?)\s*)?\}\}/g,
    (_, srcNs: string, caption?: string) => {
      const cleanPath = srcNs.replace(/^:+/, "").replace(/:/g, "/");
      const ext = ("." + (cleanPath.split(".").pop() ?? "")).toLowerCase();
      const cap = (caption ?? "").trim();
      if (IMAGE_EXTS.has(ext)) {
        return `![${cap}](/images/${cleanPath})`;
      }
      const label = cap || cleanPath.split("/").pop() || cleanPath;
      return `[${label}](/images/${cleanPath})`;
    },
  );

  // Safety net: escape any stray `{{` left in the markdown so VitePress/Vue
  // doesn't interpret it as a template interpolation expression.
  text = text.replace(/\{\{/g, "&#123;&#123;");

  // Links: [[target|label]]  or  [[target]]
  text = text.replace(/\[\[\s*([^\]|]+?)\s*(?:\|\s*([^\]]+?)\s*)?\]\]/g, (
    _,
    target: string,
    label?: string,
  ) => {
    target = target.trim();
    const labelText = (label ?? deriveLabel(target)).trim();
    // External: starts with scheme://, mailto:, www., or contains a dot in first segment
    if (/^([a-z]+:\/\/|mailto:|tel:|ftp:|www\.)/i.test(target)) {
      const url = target.startsWith("www.") ? `https://${target}` : target;
      return `[${labelText}](${url})`;
    }
    if (/^#/.test(target)) {
      return `[${labelText}](${target})`;
    }
    // Internal DokuWiki link
    let path = nsToPath(target.replace(/#.*$/, ""));
    let anchor = target.includes("#") ? `#${target.split("#")[1]}` : "";
    // Apply same normalizations as targetPathFor
    path = path.replace(
      /^reprap\/anet\/a8\/improvement\//,
      "reprap/anet/a8/improvements/",
    );
    path = path.replace(/^reprap\/creatility\//, "reprap/creality/");
    path = path.replace(
      /^reprap\/printers\/opensource\//,
      "reprap/opensource/",
    );
    if (path.endsWith("/home")) path = path.replace(/\/home$/, "");
    path = path.toLowerCase();

    // Merged-into pages → redirect to anchor on host page.
    const merged = opts.mergeRedirects.get(path);
    if (merged) {
      const [host, hostAnchor] = merged.split("#");
      const rel = relativeLink(opts.selfTarget, host) + (anchor || `#${hostAnchor}`);
      return `[${labelText}](${rel})`;
    }
    if (opts.validTargets.has(path)) {
      const rel = relativeLink(opts.selfTarget, path) + anchor;
      return `[${labelText}](${rel})`;
    }
    // Fuzzy fallback (whitespace / underscore / dash insensitive)
    const fuzzy = opts.fuzzyTargets.get(fuzzyKey(path));
    if (fuzzy) {
      const rel = relativeLink(opts.selfTarget, fuzzy) + anchor;
      return `[${labelText}](${rel})`;
    }
    // Dropped or unknown target → keep label as plain text
    return labelText;
  });

  // Inline formatting
  text = text.replace(/\/\/([^\n/]+?)\/\//g, "*$1*"); // italic
  // Underline: DokuWiki `__text__`. Markdown has no native underline, and
  // emitting `<u>...</u>` lets markdown-it process inner content, which can
  // unbalance tags (e.g. an unmatched `*` inside the span). Escape `*` and `_`
  // inside the span to HTML entities so markdown leaves them alone.
  text = text.replace(/__([^\n_]+?)__/g, (_, inner: string) => {
    const safe = inner.replace(/\*/g, "&#42;").replace(/_/g, "&#95;");
    return `<u>${safe}</u>`;
  });
  text = text.replace(/<del>([\s\S]*?)<\/del>/g, "~~$1~~");
  text = text.replace(/<sub>([\s\S]*?)<\/sub>/g, "<sub>$1</sub>"); // already valid HTML
  text = text.replace(/<sup>([\s\S]*?)<\/sup>/g, "<sup>$1</sup>");

  // Line breaks `\\` at end of line or followed by space
  text = text.replace(/\\\\(\s|$)/g, "  \n"); // two-space trailing = MD line break

  // Lists: DokuWiki uses leading spaces + `*` or `-`. Markdown wants no leading
  // space at level 0, two-space indents for nesting. Normalize so 2-space → 0,
  // 4-space → 2, etc.
  text = text.replace(/^( +)([*-])\s+/gm, (_, sp: string, marker: string) => {
    const depth = Math.floor((sp.length - 2) / 2);
    return `${"  ".repeat(Math.max(0, depth))}${marker === "-" ? "1." : "-"} `;
  });

  // Tables: convert ^/| rows into markdown tables.
  text = convertTables(text);

  // Restore placeholders
  text = text.replace(/\x00(\d+)\x00/g, (_, i) => placeholders[Number(i)]);

  // Collapse 3+ blank lines down to 2
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim() + "\n";
}

/** Compute a clean cleanUrls-compatible relative link from selfPath to target. */
function relativeLink(selfPath: string, target: string): string {
  // Both are docs-relative slug paths without .md
  const selfDir = selfPath.includes("/")
    ? selfPath.slice(0, selfPath.lastIndexOf("/"))
    : "";
  const sParts = selfDir ? selfDir.split("/") : [];
  const tParts = target.split("/");
  let i = 0;
  while (i < sParts.length && i < tParts.length && sParts[i] === tParts[i]) i++;
  const up = sParts.length - i;
  const restParts = tParts.slice(i);

  // Edge case: when target is exactly an ancestor directory of `self` (e.g.
  // self=reprap/anet/a8/locknuts, target=reprap/anet/a8), `./` would resolve
  // to `reprap/anet/a8/index.md` which doesn't exist (the parent page lives
  // at `reprap/anet/a8.md`). Step up one level and link the last segment.
  if (restParts.length === 0) {
    const lastSeg = tParts[tParts.length - 1] ?? "";
    return "../".repeat(up + 1) + lastSeg;
  }

  return (up === 0 ? "./" : "../".repeat(up)) + restParts.join("/");
}

/** DokuWiki tables → Markdown tables (best-effort). */
function convertTables(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^[\^|]/.test(line.trim()) && /[\^|]$/.test(line.trim())) {
      // Start of a table block
      const tbl: string[] = [];
      while (i < lines.length && /^[\^|]/.test(lines[i].trim())) {
        tbl.push(lines[i]);
        i++;
      }
      out.push(...renderTable(tbl));
    } else {
      out.push(line);
      i++;
    }
  }
  return out.join("\n");
}

function renderTable(rows: string[]): string[] {
  // Each row: split on `|` or `^` while remembering which delimiter introduces
  // each cell. Header cells are those preceded by `^`.
  type Cell = { text: string; isHeader: boolean };
  const parsed: Cell[][] = [];
  for (const raw of rows) {
    let trimmed = raw.trim();
    if (!trimmed) continue;
    // Collapse trailing `^^` / `||` (DokuWiki colspan markers) down to a single
    // closing delimiter — we can't reproduce colspan in markdown.
    trimmed = trimmed.replace(/([|^])\1+$/g, "$1");
    const cells: Cell[] = [];
    const tokens = trimmed.split(/([|^])/).filter((t) => t !== "");
    let isHeader = false;
    let started = false;
    let buf = "";
    for (const tok of tokens) {
      if (tok === "|" || tok === "^") {
        if (started) {
          let text = buf.trim();
          // `:::` is a DokuWiki rowspan marker — render as empty cell.
          if (text === ":::") text = "";
          cells.push({ text, isHeader });
          buf = "";
        }
        isHeader = tok === "^";
        started = true;
      } else {
        buf += tok;
      }
    }
    parsed.push(cells);
  }
  if (parsed.length === 0) return [];

  // Determine widest row to pad short ones
  const cols = Math.max(...parsed.map((r) => r.length));
  const norm = parsed.map((r) =>
    r.length < cols
      ? [...r, ...Array.from({ length: cols - r.length }, () => ({ text: "", isHeader: false }))]
      : r,
  );

  // Find header rows (first contiguous block where every cell is header).
  const isAllHeader = (r: Cell[]) =>
    r.every((c) => c.isHeader) && r.some((c) => c.text !== "");

  const headerRows = [];
  let bodyStart = 0;
  while (bodyStart < norm.length && isAllHeader(norm[bodyStart])) {
    headerRows.push(norm[bodyStart]);
    bodyStart++;
  }

  const lines: string[] = [];
  const fmtCell = (c: Cell): string => {
    if (!c.text) return " ";
    return c.isHeader ? `**${c.text}**` : c.text;
  };
  if (headerRows.length === 0) {
    // synthesize empty header so markdown table is valid
    lines.push(`| ${Array.from({ length: cols }, () => " ").join(" | ")} |`);
    lines.push(`|${Array.from({ length: cols }, () => "---").join("|")}|`);
  } else {
    // Use the last header row as the actual table header (others become rows)
    const head = headerRows[headerRows.length - 1];
    lines.push(`| ${head.map((c) => c.text || " ").join(" | ")} |`);
    lines.push(`|${Array.from({ length: cols }, () => "---").join("|")}|`);
    for (const hr of headerRows.slice(0, -1)) {
      lines.push(`| ${hr.map(fmtCell).join(" | ")} |`);
    }
  }
  for (const r of norm.slice(bodyStart)) {
    lines.push(`| ${r.map(fmtCell).join(" | ")} |`);
  }
  return ["", ...lines, ""];
}

// ---------------------------------------------------------------------------
// File walker
// ---------------------------------------------------------------------------

async function walk(dir: string): Promise<string[]> {
  const { readdir, stat } = await import("node:fs/promises");
  const out: string[] = [];
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) out.push(...(await walk(full)));
    else if (s.isFile() && entry.endsWith(".txt")) out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Geeetech French → English translation (hardcoded for the one short page)
// ---------------------------------------------------------------------------

const GEEETECH_I3_EN = `# Geeetech i3

Geeetech i3 is a Prusa-style 3D printer made in China. Variants include the
Pro A, Pro B and Pro X.

## X-axis belt routing — common assembly mistake

> The assembly videos and photographs in Geeetech's instructions for this
> model contain an error.

The stop collars on the smooth rods (which carry the X-axis motion) should be
mounted on the inside, between the two carriages on the Z axes.

The X-axis drive belt is tensioned between the two carriages that ride on the
Z rods. This belt tends to pull the Z rods toward each other and therefore
deforms the geometry of the Z axis. The Z motors then have to drive
mis-aligned rods while fighting against the belt tension, which acts as a
brake on rotation.

![X / Z assembly diagram showing the issue](/images/printers/montage_x-z.jpg)

A schematic of the forces involved (apologies — I'm not a graphic designer):

![Force diagram of belt pulling Z rods together](/images/printers/i3_belt_x-z.png)
`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface Stats {
  converted: number;
  skipped: number;
  merged: number;
  rewriteSkipped: number;
  errors: number;
}

async function main() {
  const triage = await parseTriage();
  console.log(`triage entries: ${triage.size}`);

  const allFiles = await walk(SRC_ROOT);
  console.log(`source .txt files: ${allFiles.length}`);

  // Build set of known valid docs targets for link resolution.
  const validTargets = new Set<string>();
  for (const [source, e] of triage) {
    if (e.action === "KEEP" || e.action === "KEEP-INDEX") {
      const t = targetPathFor(source);
      if (t) validTargets.add(t.replace(/\.md$/, ""));
    }
  }
  // REWRITE targets that we've already authored manually
  validTargets.add("index");
  validTargets.add("disclaimer");
  validTargets.add("privacy");
  // MERGE target pages
  validTargets.add("printers/geeetech/i3");

  // Merge-source → host-page#anchor redirects, used for link resolution.
  const mergeRedirects = new Map<string, string>([
    ["reprap/anet/a8/whitecondoms", "reprap/anet/a8#what-are-the-white-covers-for"],
    ["reprap/creatility/ender-3", "reprap/creality/ender-3#additional-notes"],
    ["printers/geetech_i3", "printers/geeetech/i3"],
    ["printers/prob", "printers/geeetech/i3"],
  ]);

  // Build fuzzy lookup map
  const fuzzyTargets = new Map<string, string>();
  for (const t of validTargets) fuzzyTargets.set(fuzzyKey(t), t);

  const stats: Stats = {
    converted: 0,
    skipped: 0,
    merged: 0,
    rewriteSkipped: 0,
    errors: 0,
  };

  // Buffers to accumulate MERGE content destined for other pages
  const mergeAppends = new Map<string, string>(); // target docs path (no ext) → markdown to append
  const queueMerge = (target: string, body: string) => {
    mergeAppends.set(
      target,
      (mergeAppends.get(target) ?? "") + "\n\n" + body,
    );
  };

  for (const absSrc of allFiles) {
    const source = absSrc.slice(SRC_ROOT.length + 1).replaceAll("\\", "/");
    const entry = triage.get(source);
    if (!entry) {
      console.warn(`! no triage entry for: ${source}`);
      stats.errors++;
      continue;
    }

    // Drops
    if (entry.action.startsWith("DROP")) {
      stats.skipped++;
      continue;
    }
    // REWRITE files already exist in docs/, handled manually
    if (entry.action === "REWRITE") {
      stats.rewriteSkipped++;
      continue;
    }

    // MERGE special cases
    if (entry.action === "MERGE") {
      const raw = await readFile(absSrc, "utf8");
      if (source === "printers/geetech_i3.txt" || source === "printers/prob.txt") {
        // Both source files become a single translated page; write only once.
        const outPath = join(DOCS_ROOT, "printers/geeetech/i3.md");
        await mkdir(dirname(outPath), { recursive: true });
        // Skip writing on second source — content is identical hardcoded blob.
        await writeFile(outPath, GEEETECH_I3_EN);
        stats.merged++;
        continue;
      }
      if (source === "reprap/anet/a8/whitecondoms.txt") {
        // One image — fold into a8 page as an extra section.
        const body = convertDokuwiki(raw, {
          validTargets,
          fuzzyTargets,
          mergeRedirects,
          selfTarget: "reprap/anet/a8",
        });
        queueMerge(
          "reprap/anet/a8",
          `## What are the white covers for?\n\n${body.trim()}\n`,
        );
        stats.merged++;
        continue;
      }
      if (source === "reprap/creatility/ender-3.txt") {
        const body = convertDokuwiki(raw, {
          validTargets,
          fuzzyTargets,
          mergeRedirects,
          selfTarget: "reprap/creality/ender-3",
        });
        queueMerge(
          "reprap/creality/ender-3",
          `## Additional notes\n\n${body.trim()}\n`,
        );
        stats.merged++;
        continue;
      }
      console.warn(`! unhandled MERGE source: ${source}`);
      stats.errors++;
      continue;
    }

    // KEEP / KEEP-INDEX → convert normally
    const target = targetPathFor(source);
    if (!target) {
      console.warn(`! no target for: ${source}`);
      stats.errors++;
      continue;
    }
    const raw = await readFile(absSrc, "utf8");
    const selfTarget = target.replace(/\.md$/, "");
    const md = convertDokuwiki(raw, { validTargets, fuzzyTargets, mergeRedirects, selfTarget });
    const outPath = join(DOCS_ROOT, target);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, md);
    stats.converted++;
  }

  // Apply pending merges
  for (const [tgt, append] of mergeAppends) {
    const path = join(DOCS_ROOT, `${tgt}.md`);
    let existing = "";
    try {
      existing = await readFile(path, "utf8");
    } catch {
      // file not produced yet — shouldn't happen with current ordering, but be safe
      console.warn(`! merge target missing on disk: ${tgt}`);
    }
    await writeFile(path, `${existing.trimEnd()}\n${append}`);
  }

  console.log(`
Conversion complete:
  converted     : ${stats.converted}
  merged        : ${stats.merged}
  rewrite (skip): ${stats.rewriteSkipped}
  dropped       : ${stats.skipped}
  errors        : ${stats.errors}
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
