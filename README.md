# 3DPrint.Wiki

A community-curated knowledge base for 3D printing, built with [VitePress](https://vitepress.dev).

This is the migrated successor to the original [3dprint.wiki](https://3dprint.wiki) DokuWiki instance. See [`migration/triage.md`](./migration/triage.md) for what was kept, dropped, and reshaped.

## Development

```bash
pnpm install
pnpm docs:dev       # local dev server on :5173
pnpm docs:build     # static build to docs/.vitepress/dist
pnpm docs:preview   # serve the built site
pnpm check:links    # verify image references resolve
pnpm clean:links    # strip tracking/affiliate params from external links (--dry to preview)
pnpm links:inventory # list every link in the wiki (--md writes a browsable report, --by-file groups by page)
```

## Migration scripts

```bash
pnpm migrate:convert    # backup/.../pages/**.txt  →  docs/**/*.md
pnpm migrate:images     # backup/.../media/**      →  docs/public/images/**  (sharp-optimised)
pnpm migrate:sidebar    # regenerate docs/.vitepress/sidebar.ts from filesystem
pnpm migrate:all        # all three, in order
```

The migration is intended to be a one-time operation. Generated `.md` files are
committed to the repo and edited directly afterwards; re-running the converter
will overwrite hand-edits.

## Layout

```
docs/                       VitePress source
  .vitepress/
    config.ts               site-wide configuration
    sidebar.ts              AUTO-GENERATED sidebar tree
    theme/                  custom theme extension
  public/                   static assets served at /
    CNAME                   custom-domain marker for GitHub Pages
    images/                 optimised media
  printers/                 all printers (Anet, Creality, Wanhao, Bambu, …) + mods/parts
  archive/                  unmaintained sections (firmware, resin)
  index.md                  home page
migration/                  one-time migration scripts and reports
  triage.md                 page-by-page disposition
  convert.ts                DokuWiki → Markdown converter
  optimize-images.ts        sharp-based media optimizer
  generate-sidebar.ts       sidebar generator
  link-check.ts             image-reference auditor
  clean-links.ts            external-link tracking-param stripper
  link-inventory.ts         collects + classifies every link (overview report)
.github/workflows/
  deploy.yml                build + deploy to GitHub Pages on push to main
backup/                     original DokuWiki dump (gitignored)
```

## Deployment

Hosted on GitHub Pages via `.github/workflows/deploy.yml`. The workflow builds
on every push to `main` and publishes the contents of `docs/.vitepress/dist`.
Custom domain is configured by `docs/public/CNAME` (`3dprint.wiki`); update or
remove that file to deploy under the default `*.github.io` URL instead.

First-time setup on a fresh repo: in **Settings → Pages**, set source to
**GitHub Actions**, then push to `main`.

## Contributing

Open a pull request. Every page has an **Edit this page on GitHub** link in the footer that drops you on the right file. No special toolchain required — VitePress is plain Markdown with optional Vue components.

## License

This repository is dual-licensed (see [`LICENSE`](./LICENSE) for full text):

- **Source code** — VitePress config/theme and the `migration/` scripts — is licensed under the [MIT License](./LICENSE).
- **Wiki content** — the Markdown pages under `docs/` and their images — is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), preserving the share-alike terms of the original 3dprint.wiki community content.

Some embedded images originate from third parties and remain subject to their own terms.
