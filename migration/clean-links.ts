/**
 * Tracking/affiliate parameter stripper for the generated docs.
 *
 * Many product links carried over from the DokuWiki dump are polluted with
 * tracking and affiliate junk (fbclid, utm_*, Amazon `ref=oh_aui_*` path
 * segments, AliExpress `spm`/`ws_ab_test`/`algo_*`, Banggood `custlinkid`/`p`,
 * …). Stripping these is lossless — the destination resource is identified by
 * the path / product id, not the tracking params.
 *
 * The script edits `docs/**.md` in place and prints every URL it rewrites so
 * the change set is auditable. Functional query params (e.g. eBay `?_nkw=`
 * search terms, AliExpress/eBay item ids living in the path) are preserved.
 *
 * Run: `pnpm clean:links`  (add `--dry` to preview without writing)
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = process.cwd();
const DOCS = path.join(ROOT, "docs");
const DRY = process.argv.includes("--dry");

/** Query params removed on ANY host. */
const TRACKING = new Set([
  // ad-network click ids
  "fbclid", "gclid", "gclsrc", "dclid", "msclkid", "yclid", "twclid",
  // generic campaign tagging
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "utm_id", "utm_name", "utm_reader", "utm_cid",
  // amazon
  "psc", "ie", "ref", "ref_", "tag", "th", "linkcode", "creative",
  "creativeasin", "ascsubtag", "smid", "pf_rd_r", "pf_rd_p", "pd_rd_r",
  "pd_rd_w", "pd_rd_wg",
  // aliexpress
  "spm", "scm", "scm_id", "pvid", "algo_expid", "algo_pvid", "algo_exp_id",
  "ws_ab_test", "transabtest", "pricebeautifyab", "aff_platform",
  "aff_trace_key", "ppcswitch", "btsid", "ws_ab",
  // banggood
  "custlinkid", "p", "rmmds", "cur_warehouse",
  // mail / analytics
  "_hsenc", "_hsmi", "mc_cid", "mc_eid", "igshid", "srsltid", "ref_src",
]);

/** True for params that are clearly tracking even if not explicitly listed. */
function isTracking(key: string): boolean {
  const k = key.toLowerCase();
  if (TRACKING.has(k)) return true;
  if (k.startsWith("searchweb")) return true; // aliexpress leftovers
  if (k.startsWith("utm_")) return true;
  if (k.startsWith("pf_rd_")) return true;
  if (k.startsWith("pd_rd_")) return true;
  return false;
}

// String-based surgery (no URL round-trip) so we only ever touch a URL when we
// actually strip junk — no trailing-slash / host-lowercase churn on clean URLs.
function cleanUrl(raw: string): string {
  // Zero-width junk (U+200B/C/D, BOM) injected by the old wiki editor.
  let url = raw.replace(/[\u200B\u200C\u200D\uFEFF]/g, "");

  const host = (url.match(/^https?:\/\/([^/?#]+)/)?.[1] ?? "").toLowerCase();

  // Split off fragment, then query.
  let hash = "";
  const hashIdx = url.indexOf("#");
  if (hashIdx >= 0) {
    hash = url.slice(hashIdx);
    url = url.slice(0, hashIdx);
  }
  let query = "";
  const qIdx = url.indexOf("?");
  if (qIdx >= 0) {
    query = url.slice(qIdx + 1);
    url = url.slice(0, qIdx);
  }

  // Amazon `/ref=…` path segment carries the affiliate/placement id.
  if (host.includes("amazon.")) {
    url = url.replace(/\/ref=[^/]*/gi, "");
    hash = "";
  }

  // Drop tracking query params, keep the rest in original order.
  if (query) {
    query = query
      .split("&")
      .filter((pair) => {
        const key = pair.split("=")[0];
        return key.length > 0 && !isTracking(key);
      })
      .join("&");
  }

  // eBay item tracking hashes like `#item285bcd5339:m:mjz…`.
  if (host.includes("ebay.") && /^#(item|g)|:m:/i.test(hash)) hash = "";

  return url + (query ? "?" + query : "") + hash;
}

// URL occurrences: both `](url)` link targets and bare URLs. `[^\s)\]]+` stops
// at the closing paren of a markdown link and at whitespace for bare URLs.
const URL_RE = /https?:\/\/[^\s)\]<>]+/g;

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

function codeRanges(md: string): [number, number][] {
  // Identify fenced/inline code ranges so we don't rewrite URLs inside them.
  const out: [number, number][] = [];
  const re = /```[\s\S]*?```|`[^`]*`/g;
  for (const m of md.matchAll(re)) {
    const start = m.index ?? 0;
    out.push([start, start + m[0].length]);
  }
  return out;
}

function inRanges(idx: number, ranges: [number, number][]): boolean {
  return ranges.some(([a, b]) => idx >= a && idx < b);
}

function main() {
  const files = walkMd(DOCS);
  let changedFiles = 0;
  let changedUrls = 0;

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const ranges = codeRanges(raw);
    const changes: [string, string][] = [];

    const next = raw.replace(URL_RE, (match, offset: number) => {
      if (inRanges(offset, ranges)) return match;
      const cleaned = cleanUrl(match);
      if (cleaned !== match) changes.push([match, cleaned]);
      return cleaned;
    });

    if (changes.length > 0) {
      changedFiles++;
      changedUrls += changes.length;
      console.log(`\n${path.relative(ROOT, file)}`);
      for (const [from, to] of changes) {
        console.log(`  - ${from}`);
        console.log(`  + ${to}`);
      }
      if (!DRY) fs.writeFileSync(file, next);
    }
  }

  console.log(
    `\n${DRY ? "[dry-run] " : ""}Cleaned ${changedUrls} URL(s) across ${changedFiles} file(s).`,
  );
}

main();
