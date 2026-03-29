# Daily Rebuild Cron — Design Spec

**Date:** 2026-03-29
**Status:** Approved

## Problem

The CGCS Astro site is statically generated. Event categorization (upcoming vs. past) is computed at build time using `new Date()` in `src/data/events.ts`. Without a rebuild, events stay in the "upcoming" section even after their date has passed.

## Solution

Trigger an automated daily rebuild of the Cloudflare Pages site at 12:01am Central Time using a GitHub Actions scheduled workflow.

## Architecture

A single GitHub Actions workflow file: `.github/workflows/daily-rebuild.yml`

**Triggers:**
- `schedule`: cron `1 6 * * *` (12:01am CST / UTC-6; 1:01am CDT / UTC-5 during summer — close enough for a nightly rebuild)
- `workflow_dispatch`: allows manual trigger from the GitHub Actions UI

**Job:** One step — HTTP POST to the Cloudflare Pages deploy hook URL stored as a GitHub secret.

## One-Time Manual Setup

1. Cloudflare Pages dashboard → your project → Settings → Builds & deployments → **Add deploy hook** → name: "Daily Rebuild" → copy the URL
2. GitHub repo → Settings → Secrets and variables → Actions → **New repository secret** → name: `CF_DEPLOY_HOOK_URL`, value: the URL from step 1

## Workflow File

```yaml
name: Daily Rebuild

on:
  schedule:
    - cron: '1 6 * * *'  # 12:01am CST (UTC-6) / 1:01am CDT (UTC-5)
  workflow_dispatch:

jobs:
  rebuild:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cloudflare Pages deploy
        run: curl -X POST "${{ secrets.CF_DEPLOY_HOOK_URL }}"
```

## What Happens

1. GitHub Actions fires at the scheduled time
2. `curl` POSTs to the Cloudflare Pages deploy hook
3. Cloudflare Pages triggers a fresh build of the site
4. Astro rebuilds; `events.ts` filters using the current date
5. Any events whose `isoDate` has passed are now in `pastEvents` and appear on `/past-events`
6. The homepage "Upcoming Events" section no longer shows those events

## No Code Changes Required in the App

The `events.ts` filtering logic is already correct. This feature only adds CI/CD infrastructure.

## Files Changed

- `.github/workflows/daily-rebuild.yml` (new)
