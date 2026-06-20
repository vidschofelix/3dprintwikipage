/**
 * Link inventory for the wiki.
 *
 * Collects every link across `docs/**.md` and classifies each one:
 *   - external : http(s)://, mailto:, tel:, ftp://, protocol-relative //…
 *   - internal : links to other pages (relative ./ ../ or site-absolute /…)
 *   - asset    : references under /images/ (images + downloadable media)
 *   - anchor   : pure in-page #fragment links
 *
 * Sources parsed: markdown links `[label](target)`, markdown images
 * `![alt](target)`, angle autolinks `<https://…>`, and bare URLs in prose.
 * Code fences and inline code are stripped first so snippets don't pollute
 * the inventory.
 *
 * Usage:
 *   pnpm links:inventory            # print summary + external domains to stdout
 *   pnpm links:inventory --by-file  # also list every link grouped by page
 *   pnpm links:inventory --md       # write a browsable report to
 *                                   #   migration/link-inventory.md
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = process.cwd();
const DOCS = path.join(ROOT, "docs");
const REPORT = path.join(ROOT, "migration", "link-inventory.md");

const args = new Set(process.argv.slice(2));
const WRITE_MD = args.has("--md");
const BY_FILE = args.has("--by-file");

type Kind = "external" | "internal" | "asset" | "anchor";

type Link = {
  file: string; // page-relative path, e.g. printers/anet/a8.md
  label: string; // link text ("" for bare URLs)
  target: string; // raw href
  kind: Kind;
  domain?: string; // for external links
};

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

function stripCode(md: string): string {
  return md.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
}

function classify(target: string): { kind: Kind; domain?: string } {
  const t = target.trim();
  if (t.startsWith("#")) return { kind: "anchor" };
  if (/^(mailto:|tel:)/i.test(t)) {
    const domain = t.replace(/^(mailto:|tel:)/i, "").split("?")[0];
    return { kind: "external", domain: t.toLowerCase().startsWith("mailto:") ? "(email)" : "(phone)" };
  }
  if (/^(https?:)?\/\//i.test(t) || /^ftp:\/\//i.test(t)) {
    try {
      const url = new URL(t.startsWith("//") ? `https:${t}` : t);
      return { kind: "external", domain: url.hostname.replace(/^www\./, "") };
    } catch {
      return { kind: "external", domain: "(unparseable)" };
    }
  }
  // Site-absolute or relative.
  const pathPart = t.split("#")[0].split("?")[0];
  if (/^\/images\//i.test(pathPart)) return { kind: "asset" };
  return { kind: "internal" };
}

// Markdown links/images: optional leading ! , [label](target). Target stops at
// whitespace or ) — we don't support titles in parens here (none in corpus).
const MD_LINK_RE = /!?\[([^\]]*)\]\(\s*([^)\s]+)[^)]*\)/g;
// Angle autolinks <https://…>
const AUTOLINK_RE = /<((?:https?|ftp|mailto):[^>\s]+)>/gi;
// Bare URLs in prose (avoid those already inside markdown parens/anchors by a
// simple heuristic: not preceded by ( or < and not inside ]( … )).
const BARE_URL_RE = /(?<![("<\]])\bhttps?:\/\/[^\s)<>\]]+/gi;

function collect(): Link[] {
  const links: Link[] = [];
  for (const abs of walkMd(DOCS)) {
    const rel = path.relative(DOCS, abs).split(path.sep).join("/");
    const text = stripCode(fs.readFileSync(abs, "utf8"));

    const mdTargets = new Set<string>();
    for (const m of text.matchAll(MD_LINK_RE)) {
      const label = m[1].trim();
      const target = m[2].trim();
      mdTargets.add(target);
      const { kind, domain } = classify(target);
      links.push({ file: rel, label, target, kind, domain });
    }
    for (const m of text.matchAll(AUTOLINK_RE)) {
      const target = m[1].trim();
      const { kind, domain } = classify(target);
      links.push({ file: rel, label: "", target, kind, domain });
    }
    for (const m of text.matchAll(BARE_URL_RE)) {
      const target = m[0].trim().replace(/[.,;]+$/, "");
      // Skip if this URL was already captured as the target of a markdown link.
      if ([...mdTargets].some((t) => t === target)) continue;
      const { kind, domain } = classify(target);
      links.push({ file: rel, label: "", target, kind, domain });
    }
  }
  return links;
}

function groupCount<T>(items: T[], key: (t: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const k = key(it);
    (map.get(k) ?? map.set(k, []).get(k)!).push(it);
  }
  return map;
}

function sortedByCountDesc(map: Map<string, Link[]>): [string, Link[]][] {
  return [...map.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]),
  );
}

function main() {
  const links = collect();
  const pages = new Set(links.map((l) => l.file)).size;

  const external = links.filter((l) => l.kind === "external");
  const internal = links.filter((l) => l.kind === "internal");
  const assets = links.filter((l) => l.kind === "asset");
  const anchors = links.filter((l) => l.kind === "anchor");

  const byDomain = groupCount(external, (l) => l.domain ?? "(unknown)");
  const uniqueExternal = new Set(external.map((l) => l.target)).size;

  // ---- console summary ----
  console.log(`Scanned ${pages} pages, ${links.length} links total.`);
  console.log(`  external : ${external.length}  (${uniqueExternal} unique, ${byDomain.size} domains)`);
  console.log(`  internal : ${internal.length}`);
  console.log(`  asset    : ${assets.length}`);
  console.log(`  anchor   : ${anchors.length}`);

  console.log(`\nExternal links by domain:`);
  for (const [domain, ls] of sortedByCountDesc(byDomain)) {
    console.log(`  ${String(ls.length).padStart(3)}  ${domain}`);
  }

  if (BY_FILE) {
    console.log(`\nLinks by page:`);
    const byFile = groupCount(links, (l) => l.file);
    for (const file of [...byFile.keys()].sort()) {
      console.log(`\n  ${file}`);
      for (const l of byFile.get(file)!) {
        const tag = l.kind[0].toUpperCase();
        const lbl = l.label ? `${l.label} ` : "";
        console.log(`    [${tag}] ${lbl}-> ${l.target}`);
      }
    }
  }

  // ---- markdown report ----
  if (WRITE_MD) {
    const out: string[] = [];
    out.push(`# Link inventory`);
    out.push("");
    out.push(
      `Generated by \`pnpm links:inventory --md\`. Scanned **${pages} pages**, **${links.length} links**.`,
    );
    out.push("");
    out.push(`## Summary`);
    out.push("");
    out.push(`| Kind | Count |`);
    out.push(`| --- | ---: |`);
    out.push(`| External | ${external.length} (${uniqueExternal} unique, ${byDomain.size} domains) |`);
    out.push(`| Internal (page) | ${internal.length} |`);
    out.push(`| Asset (/images) | ${assets.length} |`);
    out.push(`| Anchor (#) | ${anchors.length} |`);
    out.push("");

    out.push(`## External links by domain`);
    out.push("");
    for (const [domain, ls] of sortedByCountDesc(byDomain)) {
      out.push(`### ${domain} (${ls.length})`);
      out.push("");
      // de-dupe identical target+label+file rows
      const seen = new Set<string>();
      for (const l of ls.sort((a, b) => a.file.localeCompare(b.file))) {
        const key = `${l.file}|${l.label}|${l.target}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const lbl = l.label || "(bare)";
        out.push(`- [${lbl}](${l.target}) — \`${l.file}\``);
      }
      out.push("");
    }

    out.push(`## Internal page links by source`);
    out.push("");
    const internByFile = groupCount(internal, (l) => l.file);
    for (const file of [...internByFile.keys()].sort()) {
      out.push(`### ${file}`);
      out.push("");
      for (const l of internByFile.get(file)!) {
        out.push(`- ${l.label || "(bare)"} → \`${l.target}\``);
      }
      out.push("");
    }

    fs.writeFileSync(REPORT, out.join("\n") + "\n", "utf8");
    console.log(`\nWrote report to ${path.relative(ROOT, REPORT)}`);
  } else {
    console.log(`\nTip: \`pnpm links:inventory --md\` writes a browsable report to migration/link-inventory.md`);
  }
}

main();
