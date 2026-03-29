# Daily Rebuild Cron Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GitHub Actions scheduled workflow that triggers a Cloudflare Pages rebuild every day at 12:01am Central Time so past events automatically migrate to the past events section.

**Architecture:** A single GitHub Actions workflow file fires a cron at `1 6 * * *` (UTC) and POSTs to a Cloudflare Pages deploy hook URL stored as a GitHub Actions secret. Cloudflare Pages rebuilds the Astro site; `events.ts` re-evaluates dates at build time and the site reflects the current state of events.

**Tech Stack:** GitHub Actions (YAML), Cloudflare Pages deploy hook (HTTP POST via curl)

---

## Pre-requisite: One-Time Manual Setup

These two steps must be completed by a human in web dashboards before the workflow can work. They cannot be automated.

**Step A — Create the Cloudflare Pages deploy hook:**
1. Go to Cloudflare Pages dashboard → select the `cgcs-astro` project
2. Settings → Builds & deployments → scroll to "Deploy hooks" → click **Add deploy hook**
3. Name it `Daily Rebuild`, select the `main` branch
4. Click **Save** and copy the generated URL (looks like `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...`)

**Step B — Add the URL as a GitHub Actions secret:**
1. Go to `https://github.com/stefanocasafranca/cgcs-astro` → Settings → Secrets and variables → Actions
2. Click **New repository secret**
3. Name: `CF_DEPLOY_HOOK_URL`
4. Value: paste the deploy hook URL from Step A
5. Click **Add secret**

---

## File Map

| Action | Path |
|--------|------|
| Create | `.github/workflows/daily-rebuild.yml` |

No application code is modified.

---

### Task 1: Create GitHub Actions workflow directory and file

**Files:**
- Create: `.github/workflows/daily-rebuild.yml`

- [ ] **Step 1: Create the `.github/workflows/` directory**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Create the workflow file**

Create `.github/workflows/daily-rebuild.yml` with this exact content:

```yaml
name: Daily Rebuild

on:
  schedule:
    - cron: '1 6 * * *'  # 12:01am CST (UTC-6) / 1:01am CDT (UTC-5)
  workflow_dispatch:      # allows manual trigger from GitHub Actions UI

jobs:
  rebuild:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cloudflare Pages deploy
        run: curl -X POST "${{ secrets.CF_DEPLOY_HOOK_URL }}"
```

- [ ] **Step 3: Verify the file exists and is valid YAML**

```bash
cat .github/workflows/daily-rebuild.yml
```

Expected: the file contents print cleanly with no syntax errors visible.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/daily-rebuild.yml
git commit -m "feat: add daily 12:01am rebuild cron via GitHub Actions"
```

- [ ] **Step 5: Push to main**

```bash
git push origin main
```

---

### Task 2: Verify the workflow is registered

- [ ] **Step 1: Confirm the workflow appears on GitHub**

Go to `https://github.com/stefanocasafranca/cgcs-astro/actions` — you should see "Daily Rebuild" in the left sidebar under "All workflows".

- [ ] **Step 2: Run a manual test trigger**

Click "Daily Rebuild" → click **Run workflow** → select `main` → click **Run workflow**.

- [ ] **Step 3: Confirm the run succeeds**

Wait ~30 seconds, refresh the page. The workflow run should show a green checkmark. If it fails:
- A red ✗ with "secret not found" means `CF_DEPLOY_HOOK_URL` secret was not added — revisit Pre-requisite Step B.
- A red ✗ with HTTP error from curl means the deploy hook URL is wrong — revisit Pre-requisite Step A.

- [ ] **Step 4: Confirm Cloudflare Pages triggered a build**

Go to Cloudflare Pages dashboard → `cgcs-astro` → Deployments. A new deployment triggered by "Deploy hook" should appear at the top of the list within a minute or two.

---

## Done

Once Task 2 Step 4 shows a successful Cloudflare Pages deployment triggered by the hook, the feature is live. The cron will fire automatically every night at 12:01am CST / 1:01am CDT, rebuilding the site and keeping upcoming/past events current.
