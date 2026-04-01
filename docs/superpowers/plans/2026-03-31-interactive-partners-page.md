# Interactive Partners Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static partners list with a GSAP scroll-animated bubble canvas (desktop) and Swiper swipeable carousel (mobile) where clicking any bubble opens a full-screen partner detail panel.

**Architecture:** Partner data lives in `src/data/partners.ts`. The page renders a dark-navy canvas on desktop with absolutely-positioned bubbles that scroll-animate in via GSAP ScrollTrigger. On mobile (<768px) a Swiper horizontal carousel replaces the canvas. A single shared `<dialog>` (PartnerPanel) is populated via `data-*` attributes and shown on bubble click.

**Tech Stack:** Astro 5.x, Tailwind CSS v4, GSAP 3.x + ScrollTrigger (npm), Swiper 11.x (npm), Clearbit Logo API + Google Favicon fallback + initial-letter CSS fallback

**Note:** Build and verify locally only — do not push until the user approves the result.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| New | `src/data/partners.ts` | All partner data — name, href, logoDomain, description, stats, size, x/y canvas positions |
| New | `src/components/PartnerBubble.astro` | Circular bubble — logo, name, data-* attributes for panel wiring |
| New | `src/components/PartnerPanel.astro` | Single shared `<dialog>` — logo, name, description, stats, Visit Website button |
| Rewrite | `src/pages/partners.astro` | Page layout, desktop bubble canvas, mobile Swiper carousel, GSAP + panel wiring scripts |

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install GSAP and Swiper**

```bash
npm install gsap swiper
```

Expected: Both added to `package.json` dependencies, no errors.

- [ ] **Step 2: Verify**

```bash
node -e "require('gsap'); require('swiper'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install gsap and swiper for interactive partners page"
```

---

### Task 2: Create partner data file

**Files:**
- Create: `src/data/partners.ts`

- [ ] **Step 1: Create the file**

Create `src/data/partners.ts`:

```typescript
export interface Partner {
  name: string;
  href: string;
  /** Override domain for logo fetching when href is a subpath of a shared platform (e.g. meetup.com) */
  logoDomain?: string;
  description?: string;
  stats?: { label: string; value: string }[];
  /** Bubble diameter tier: sm=80px, md=130px, lg=180px */
  size: 'sm' | 'md' | 'lg';
  /** Desktop canvas position as % of container — refers to bubble center */
  x: number;
  y: number;
}

export const partners: Partner[] = [
  {
    name: 'ACM at ACC',
    href: 'https://www.austincs.org/',
    size: 'sm',
    x: 12, y: 12,
  },
  {
    name: 'ACM Austin Chapter',
    href: 'https://www.meetup.com/acm-austin/',
    logoDomain: 'acm.org',
    size: 'sm',
    x: 92, y: 35,
  },
  {
    name: 'Army Software Factory',
    href: 'https://soldiersolutions.swf.army.mil/',
    logoDomain: 'army.mil',
    description: 'The Army Software Factory develops software talent and delivers digital solutions for the U.S. Army.',
    size: 'md',
    x: 38, y: 10,
  },
  {
    name: 'ATX Design Jams',
    href: 'https://www.meetup.com/meetup-group-atxdesignjam/',
    logoDomain: 'eventbrite.com',
    size: 'sm',
    x: 38, y: 58,
  },
  {
    name: 'Austin AI Alliance',
    href: 'https://austin-ai.org/',
    description: 'The Austin AI Alliance connects the local AI community through events, networking, and education.',
    size: 'lg',
    x: 22, y: 38,
  },
  {
    name: 'Austin Forum of Technology',
    href: 'https://www.austinforum.org/',
    description: 'Austin Forum on Technology & Society hosts public conversations at the intersection of technology and civic life.',
    size: 'md',
    x: 62, y: 15,
  },
  {
    name: 'Braver Angels',
    href: 'https://braverangels.org/',
    description: 'Braver Angels works to depolarize America by bringing liberals and conservatives together.',
    size: 'md',
    x: 85, y: 12,
  },
  {
    name: 'City of Austin',
    href: 'https://www.austintexas.gov/opengovernmentpartnership',
    logoDomain: 'austintexas.gov',
    description: 'The City of Austin Open Government Partnership promotes transparency, civic participation, and accountability.',
    size: 'lg',
    x: 12, y: 65,
  },
  {
    name: 'Cyversity',
    href: 'https://www.cyversity.org/',
    description: 'Cyversity increases diversity and inclusion in the cybersecurity industry through education and mentorship.',
    size: 'sm',
    x: 50, y: 32,
  },
  {
    name: 'LangChain',
    href: 'https://www.langchain.com/',
    description: 'LangChain builds tools and infrastructure for developing applications powered by large language models.',
    size: 'lg',
    x: 72, y: 42,
  },
  {
    name: 'Open Austin',
    href: 'http://open-austin.org/',
    description: 'Open Austin is a civic technology and open government organization advocating for a more open and connected Austin.',
    size: 'sm',
    x: 80, y: 60,
  },
  {
    name: 'Public Service Desk',
    href: 'https://thepublicservicedesk.org/',
    description: 'The Public Service Desk connects citizens with resources and services to strengthen community resilience.',
    size: 'md',
    x: 25, y: 85,
  },
  {
    name: 'SerpApi',
    href: 'https://serpapi.com/',
    description: 'SerpApi provides a real-time API to access search engine results, supporting research and civic technology projects.',
    size: 'md',
    x: 55, y: 70,
  },
  {
    name: 'Service Learning ACC',
    href: 'https://servicelearning.austincc.edu/',
    logoDomain: 'austincc.edu',
    description: 'Service Learning at ACC integrates community service with instruction to enrich learning and civic responsibility.',
    size: 'sm',
    x: 68, y: 85,
  },
  {
    name: 'Skull Games',
    href: 'https://skullgames.org/',
    description: 'Skull Games Society uses game design and play to build community and develop civic leadership skills.',
    size: 'sm',
    x: 88, y: 80,
  },
  {
    name: 'United Way',
    href: 'https://unitedwayaustin.org/',
    description: 'United Way for Greater Austin fights for the health, education, and financial stability of every person in our community.',
    size: 'md',
    x: 45, y: 85,
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx astro check 2>&1 | head -15
```

Expected: No errors from `src/data/partners.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/data/partners.ts
git commit -m "feat: add partners data file with canvas positions and descriptions"
```

---

### Task 3: Create PartnerBubble component

**Files:**
- Create: `src/components/PartnerBubble.astro`

- [ ] **Step 1: Create the file**

Create `src/components/PartnerBubble.astro`:

```astro
---
import type { Partner } from '../data/partners';

interface Props {
  partner: Partner;
}

const { partner } = Astro.props;

let domain: string;
if (partner.logoDomain) {
  domain = partner.logoDomain;
} else {
  try {
    domain = new URL(partner.href).hostname.replace(/^www\./, '');
  } catch {
    domain = '';
  }
}

const clearbitUrl = `https://logo.clearbit.com/${domain}`;
const faviconUrl  = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
const initial     = partner.name.charAt(0).toUpperCase();

const sizeMap = {
  sm: { outer: 'w-20 h-20',  img: 'w-10 h-10', text: 'text-[10px]' },
  md: { outer: 'w-32 h-32',  img: 'w-16 h-16', text: 'text-xs'     },
  lg: { outer: 'w-44 h-44',  img: 'w-24 h-24', text: 'text-sm'     },
};
const sz = sizeMap[partner.size];
---

<div
  class={`partner-bubble absolute flex flex-col items-center justify-center rounded-full bg-white shadow-xl cursor-pointer select-none ${sz.outer}`}
  style={`left: ${partner.x}%; top: ${partner.y}%; transform: translate(-50%, -50%);`}
  data-name={partner.name}
  data-href={partner.href}
  data-description={partner.description ?? ''}
  data-stats={JSON.stringify(partner.stats ?? [])}
  data-clearbit={clearbitUrl}
  data-favicon={faviconUrl}
  data-initial={initial}
  role="button"
  tabindex="0"
  aria-label={`View ${partner.name} partner details`}
>
  <img
    class={`object-contain rounded-sm bubble-logo ${sz.img}`}
    src={clearbitUrl}
    alt={partner.name}
    draggable="false"
  />
  <div
    class={`bubble-initial hidden rounded-full bg-[#1e3a5f] items-center justify-center text-white font-bold ${sz.img}`}
    aria-hidden="true"
  >
    <span>{initial}</span>
  </div>
  <span class={`${sz.text} font-semibold text-center text-gray-700 px-2 mt-1 leading-tight max-w-full line-clamp-2`}>
    {partner.name}
  </span>
</div>

<style>
  .partner-bubble {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .partner-bubble:hover {
    transform: translate(-50%, -50%) scale(1.07) !important;
    box-shadow: 0 12px 40px rgba(0,0,0,0.25);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PartnerBubble.astro
git commit -m "feat: add PartnerBubble component"
```

---

### Task 4: Create PartnerPanel component

**Files:**
- Create: `src/components/PartnerPanel.astro`

- [ ] **Step 1: Create the file**

Create `src/components/PartnerPanel.astro`:

```astro
---
// No props — content populated via JS from bubble data-* attributes on click
---

<dialog
  id="partner-panel"
  class="fixed inset-0 w-screen h-screen max-w-none max-h-none m-0 p-0 bg-transparent"
  aria-modal="true"
>
  <!-- Panel card -->
  <div class="panel-card absolute inset-4 md:inset-16 lg:inset-24 bg-white rounded-3xl flex flex-col items-center justify-center gap-6 p-8 md:p-12 overflow-y-auto">

    <!-- Close -->
    <button
      id="panel-close"
      class="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
      aria-label="Close partner details"
    >
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Logo -->
    <div class="w-28 h-28 flex items-center justify-center flex-shrink-0">
      <img id="panel-logo" src="" alt="" class="max-w-full max-h-full object-contain" />
      <div
        id="panel-initial"
        class="hidden w-28 h-28 rounded-full bg-[#1e3a5f] items-center justify-center text-white text-4xl font-bold"
      ></div>
    </div>

    <!-- Name -->
    <h2 id="panel-name" class="text-3xl md:text-4xl font-bold text-[#1e3a5f] text-center"></h2>

    <!-- Description -->
    <p id="panel-description" class="text-gray-600 text-center max-w-lg text-base leading-relaxed"></p>

    <!-- Stats -->
    <div id="panel-stats" class="flex flex-wrap gap-8 justify-center"></div>

    <!-- CTA -->
    <a
      id="panel-link"
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-2 bg-[#00A651] hover:bg-[#1e3a5f] text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 inline-flex items-center gap-2"
    >
      Visit Website
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  </div>
</dialog>

<style>
  #partner-panel {
    opacity: 0;
    transition: opacity 0.25s ease;
  }
  #partner-panel[open] {
    opacity: 1;
  }
  #partner-panel::backdrop {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
  }
  .panel-card {
    transform: scale(0.88);
    transition: transform 0.25s ease;
  }
  #partner-panel[open] .panel-card {
    transform: scale(1);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PartnerPanel.astro
git commit -m "feat: add PartnerPanel dialog component"
```

---

### Task 5: Rewrite partners.astro

**Files:**
- Rewrite: `src/pages/partners.astro`

- [ ] **Step 1: Replace the file entirely**

Replace the full contents of `src/pages/partners.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PartnerBubble from '../components/PartnerBubble.astro';
import PartnerPanel from '../components/PartnerPanel.astro';
import { partners } from '../data/partners';

const guidelines = [
  {
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />`,
    title: '1. ACC Students Growth Pathway',
    description: 'Support student growth through mentorship, projects, or career pathways.',
  },
  {
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />`,
    title: '2. Hosting Multiple Events',
    description: 'Host or co-host learning events aligned with CGCS initiatives.',
  },
  {
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
    title: '3. Sponsor For CGCS Events',
    description: 'Provide financial or in-kind support for CGCS programs and events.',
  },
];
---

<BaseLayout title="Partners">

  <!-- Header -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-text-dark mb-6">Our Partners</h1>
        <p class="text-lg text-text-light">
          To be considered a CGCS partner—like the organizations featured on this page—there are several ways to collaborate with us. Below, we outline the three most common partnership pathways and you just need to fill one of the criteria (See Partner Guidelines)
        </p>
      </div>
    </div>
  </section>

  <!-- Desktop: Bubble Canvas -->
  <section
    id="bubble-canvas"
    class="hidden md:block relative w-full bg-[#1e3a5f] overflow-hidden"
    style="min-height: 900px;"
    aria-label="Partner organizations"
  >
    {partners.map((partner) => (
      <PartnerBubble partner={partner} />
    ))}
  </section>

  <!-- Mobile: Swiper Carousel -->
  <section class="md:hidden bg-[#1e3a5f] py-12 px-4" aria-label="Partner organizations">
    <div class="swiper partners-swiper">
      <div class="swiper-wrapper pb-10">
        {partners.map((partner) => {
          let domain = '';
          if (partner.logoDomain) {
            domain = partner.logoDomain;
          } else {
            try { domain = new URL(partner.href).hostname.replace(/^www\./, ''); } catch {}
          }
          const clearbitUrl = `https://logo.clearbit.com/${domain}`;
          const faviconUrl  = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          const initial     = partner.name.charAt(0).toUpperCase();
          return (
            <div
              class="swiper-slide flex justify-center"
              data-name={partner.name}
              data-href={partner.href}
              data-description={partner.description ?? ''}
              data-stats={JSON.stringify(partner.stats ?? [])}
              data-clearbit={clearbitUrl}
              data-favicon={faviconUrl}
              data-initial={initial}
            >
              <div
                class="partner-bubble-mobile w-36 h-36 rounded-full bg-white shadow-xl flex flex-col items-center justify-center cursor-pointer p-2"
                role="button"
                tabindex="0"
                aria-label={`View ${partner.name} details`}
              >
                <img class="w-16 h-16 object-contain bubble-logo-mobile" src={clearbitUrl} alt={partner.name} draggable="false" />
                <div class="bubble-initial-mobile hidden w-16 h-16 rounded-full bg-[#1e3a5f] items-center justify-center text-white font-bold text-2xl" aria-hidden="true">
                  <span>{initial}</span>
                </div>
                <span class="text-[10px] font-semibold text-center text-gray-700 px-1 mt-1 leading-tight">{partner.name}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </section>

  <!-- Partner Guidelines -->
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto">
        <h3 class="text-2xl font-bold text-text-dark mb-4">Partner Guidelines</h3>
        <p class="text-text-light mb-8">
          Fill <span class="font-bold">One of the Three Criteria</span> to Become a Partner
        </p>
        <div class="space-y-6">
          {guidelines.map((guideline) => (
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" set:html={guideline.icon} />
                </div>
                <div>
                  <h4 class="font-bold text-text-dark mb-2">{guideline.title}</h4>
                  <p class="text-text-light">{guideline.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>

  <!-- Shared panel dialog (one instance, content swapped by JS) -->
  <PartnerPanel />

  <script>
    import gsap from 'gsap';
    import ScrollTrigger from 'gsap/ScrollTrigger';
    import Swiper from 'swiper';
    import { Pagination } from 'swiper/modules';
    import 'swiper/css';
    import 'swiper/css/pagination';

    gsap.registerPlugin(ScrollTrigger);

    // ── Logo fallback (Clearbit → favicon → initial letter) ──────────────
    function attachFallback(img: HTMLImageElement, faviconUrl: string, initialEl: HTMLElement) {
      let stage = 0;
      img.addEventListener('error', () => {
        stage++;
        if (stage === 1) {
          img.src = faviconUrl;
        } else {
          img.style.display = 'none';
          initialEl.style.display = 'flex';
        }
      });
    }

    document.querySelectorAll<HTMLElement>('.partner-bubble').forEach((el) => {
      const img       = el.querySelector<HTMLImageElement>('.bubble-logo')!;
      const initialEl = el.querySelector<HTMLElement>('.bubble-initial')!;
      if (img && initialEl) attachFallback(img, el.dataset.favicon!, initialEl);
    });

    document.querySelectorAll<HTMLElement>('.partner-bubble-mobile').forEach((el) => {
      const slide     = el.closest<HTMLElement>('[data-name]')!;
      const img       = el.querySelector<HTMLImageElement>('.bubble-logo-mobile')!;
      const initialEl = el.querySelector<HTMLElement>('.bubble-initial-mobile')!;
      if (img && initialEl && slide) attachFallback(img, slide.dataset.favicon!, initialEl);
    });

    // ── GSAP ScrollTrigger — desktop bubbles ─────────────────────────────
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const offsets = [
        { x: -60, y: 0  },
        { x:  60, y: 0  },
        { x:   0, y: 60 },
        { x: -40, y: 40 },
        { x:  40, y:-40 },
      ];
      document.querySelectorAll<HTMLElement>('.partner-bubble').forEach((el, i) => {
        const off = offsets[i % offsets.length];
        gsap.fromTo(el,
          { opacity: 0, x: off.x, y: off.y },
          {
            opacity: 1, x: 0, y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }

    // ── Swiper — mobile carousel ─────────────────────────────────────────
    const swiperEl = document.querySelector<HTMLElement>('.partners-swiper');
    if (swiperEl) {
      new Swiper(swiperEl, {
        modules: [Pagination],
        slidesPerView: 1.5,
        centeredSlides: true,
        spaceBetween: 20,
        pagination: { el: '.swiper-pagination', clickable: true },
      });
    }

    // ── Panel open / close ───────────────────────────────────────────────
    const dialog      = document.getElementById('partner-panel')   as HTMLDialogElement;
    const panelLogo   = document.getElementById('panel-logo')      as HTMLImageElement;
    const panelInit   = document.getElementById('panel-initial')   as HTMLElement;
    const panelName   = document.getElementById('panel-name')      as HTMLElement;
    const panelDesc   = document.getElementById('panel-description') as HTMLElement;
    const panelStats  = document.getElementById('panel-stats')     as HTMLElement;
    const panelLink   = document.getElementById('panel-link')      as HTMLAnchorElement;
    const closeBtn    = document.getElementById('panel-close')     as HTMLButtonElement;

    interface BubbleData {
      name: string; href: string; description: string;
      stats: { label: string; value: string }[];
      clearbit: string; favicon: string; initial: string;
    }

    function openPanel(d: BubbleData) {
      // Reset logo state
      panelLogo.style.display = 'block';
      panelInit.style.display = 'none';
      panelInit.textContent   = d.initial;
      panelLogo.alt           = d.name;

      let logoStage = 0;
      panelLogo.onerror = () => {
        logoStage++;
        if (logoStage === 1) { panelLogo.src = d.favicon; }
        else { panelLogo.style.display = 'none'; panelInit.style.display = 'flex'; }
      };
      panelLogo.src = d.clearbit;

      panelName.textContent       = d.name;
      panelDesc.textContent       = d.description;
      panelDesc.style.display     = d.description ? 'block' : 'none';

      panelStats.innerHTML = '';
      if (d.stats.length) {
        d.stats.forEach(({ label, value }) => {
          panelStats.innerHTML += `
            <div class="text-center">
              <div class="text-2xl font-bold text-[#00A651]">${value}</div>
              <div class="text-xs text-gray-500 uppercase tracking-wide">${label}</div>
            </div>`;
        });
      }
      panelStats.style.display = d.stats.length ? 'flex' : 'none';
      panelLink.href = d.href;

      dialog.showModal();
    }

    function closePanel() { dialog.close(); }

    closeBtn.addEventListener('click', closePanel);
    dialog.addEventListener('click', (e) => { if (e.target === dialog) closePanel(); });

    function bubbleDataFrom(el: HTMLElement): BubbleData {
      return {
        name:        el.dataset.name!,
        href:        el.dataset.href!,
        description: el.dataset.description ?? '',
        stats:       JSON.parse(el.dataset.stats ?? '[]'),
        clearbit:    el.dataset.clearbit!,
        favicon:     el.dataset.favicon!,
        initial:     el.dataset.initial!,
      };
    }

    // Desktop bubbles
    document.querySelectorAll<HTMLElement>('.partner-bubble').forEach((el) => {
      el.addEventListener('click', () => openPanel(bubbleDataFrom(el)));
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') el.click(); });
    });

    // Mobile bubbles (data-* lives on the slide parent)
    document.querySelectorAll<HTMLElement>('.partner-bubble-mobile').forEach((el) => {
      el.addEventListener('click', () => {
        const slide = el.closest<HTMLElement>('[data-name]');
        if (slide) openPanel(bubbleDataFrom(slide));
      });
    });
  </script>

</BaseLayout>
```

- [ ] **Step 2: Check dev server starts without errors**

```bash
npm run dev 2>&1 | grep -E "error|Error|ready" | head -10
```

Expected: `astro  vX.X ready in ...ms` — no error lines.

- [ ] **Step 3: Commit**

```bash
git add src/pages/partners.astro
git commit -m "feat: rewrite partners page — bubble canvas, GSAP scroll animations, Swiper carousel, partner panel"
```

---

### Task 6: Verify locally

- [ ] **Step 1: Open** `http://localhost:4321/partners`

- [ ] **Step 2: Verify desktop canvas**
  - Dark navy canvas visible below the header
  - 16 bubbles scattered organically with logos (or letter fallback)
  - Scroll down — bubbles drift in from the side
  - Hover — subtle scale-up

- [ ] **Step 3: Verify panel**
  - Click any bubble → full-screen panel opens with smooth scale-in
  - Shows logo/fallback, partner name, description, Visit Website button
  - X button closes it
  - Escape key closes it
  - Clicking the dark backdrop closes it

- [ ] **Step 4: Verify mobile carousel**
  - Resize browser to <768px (or DevTools → mobile emulation)
  - Desktop canvas hidden; Swiper carousel appears
  - Swipe left/right with momentum
  - Pagination dots visible below
  - Tap a bubble → same panel opens

- [ ] **Step 5: Tell the user — ready to review**

Once all checks pass, let the user know the page is live at `http://localhost:4321/partners` for review. **Do not push** until the user approves.

---

## Done

When the user approves locally:

```bash
git push origin main
```

Cloudflare Pages will deploy automatically via the daily rebuild workflow, or can be triggered manually.
