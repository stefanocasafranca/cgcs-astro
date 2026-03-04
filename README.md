# CGCS Astro Site

Frontend for the **Center for Government & Civic Service (CGCS)** at Austin Community College. Built with Astro 5 + Tailwind CSS.

## Pages

| Route | Description |
|---|---|
| `/` | Homepage |
| `/event-space` | Event space info |
| `/book-event-space` | Booking form (POSTs to N8N) |
| `/contact` | Contact page |
| `/partners` | Partners page |
| `/initiatives/*` | Initiative sub-pages |

## Running Locally

### Prerequisites

- Node.js 18+
- N8N running at `localhost:5678` (for form submissions to work)

### Setup

```bash
npm install

# Copy env and set your N8N webhook URL
cp .env.example .env
# .env default already points to localhost:5678 — no change needed for local dev
```

### Dev server

```bash
npm run dev
# Site available at http://localhost:4321
```

### Build

```bash
npm run build      # Output to ./dist/
npm run preview    # Preview the build locally
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PUBLIC_N8N_WEBHOOK_URL` | N8N endpoint that receives form submissions | `http://localhost:5678/webhook/intake/event-space` |

> **Note:** `PUBLIC_` prefix is required — Astro only exposes env vars with this prefix to the browser.

## Can I Run This Without N8N?

**Yes, but form submissions will fail.** The site builds and renders fine without N8N. If `PUBLIC_N8N_WEBHOOK_URL` points to an unreachable server, the form will show an error message after submit. Everything else on the site works independently.

## Deployment

This is a static site (no server-side rendering). For production:

1. Set `PUBLIC_N8N_WEBHOOK_URL` in your hosting platform's env vars to the production N8N URL (e.g. `https://n8n.yourdomain.com/webhook/intake/event-space`)
2. Run `npm run build` — deploy the `./dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, etc.)
