# Qignite Website

Marketing site for Qignite, built with [Astro](https://astro.build).

## Setup

```bash
npm install
npm run dev
```

| Command | Action |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `SITE_URL` | **Yes, before production deploy** | The site's production URL, no trailing slash (e.g. `https://qignite.com`). Drives canonical links, OG/Twitter tags, JSON-LD URLs, `robots.txt`, and sitemap generation. |

Copy `.env.example` to `.env` and set `SITE_URL` for a local build that reflects the real domain. If unset, it falls back to `https://example.com` so local dev and CI builds work without it.

**Before deploying to production, `SITE_URL` must be set to the real domain** in your hosting provider's environment variable settings (this project doesn't have a domain/hosting provider finalized yet — do not deploy with the placeholder value).
