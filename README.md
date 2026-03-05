# CGCS Astro Site

Frontend for the **Center for Government & Civic Service (CGCS)** at Austin Community College. Built with Astro 5 + Tailwind CSS.

## Pages

| Route | Description |
|---|---|
| `/` | Homepage |
| `/event-space` | Event space info |
| `/book-event-space` | Booking form (POSTs to Web3Forms → email) |
| `/contact` | Contact page |
| `/partners` | Partners page |
| `/initiatives/*` | Initiative sub-pages |

## Running Locally

### Prerequisites

- Node.js 18+

### Setup

```bash
npm install

# Copy env and add your Web3Forms key
cp .env.example .env
# Get a free key at https://web3forms.com — enter admin@cgcsacc.org
# Then set: PUBLIC_WEB3FORMS_KEY=your-key-here
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

| Variable | Description |
|---|---|
| `PUBLIC_WEB3FORMS_KEY` | Web3Forms access key — form submissions are emailed to the address you registered at web3forms.com |

> **Note:** `PUBLIC_` prefix is required — Astro bakes these into the static build at build time.

## Form Submission Flow

Form → Web3Forms API → Email to `admin@cgcsacc.org`

**Future:** When the n8n automation server is deployed, swap `PUBLIC_WEB3FORMS_KEY` for `PUBLIC_N8N_WEBHOOK_URL` pointing to `https://n8n.yourdomain.com/webhook/intake/event-space` and update the fetch in `book-event-space.astro`.

## Deployment

This is a static site (no server-side rendering).

1. Set `PUBLIC_WEB3FORMS_KEY` in your hosting platform's env vars
2. Run `npm run build` — deploy the `./dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, etc.)
