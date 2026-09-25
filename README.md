# porto-web: Bakti Surya Atmaja (Maja)

Personal portfolio, projects archive and engineering journal. Built with **SvelteKit 2 + Svelte 5**, **Threlte (Three.js)**, **Tailwind CSS v4**, **GSAP 3 + ScrollTrigger** and **Lenis**. Every route is prerendered, so the deployable artifact is a plain folder of HTML.

The visual language is a tactical HUD: true black or bunker cream, one accent colour, hairlines, corner reticles, and an interactive sky of the 88 IAU constellations behind the hero.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into build/ (must exit 0 before committing)
npm run preview  # serve the production build locally
```

Editing content? Start with **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)**. Working as an AI agent? Read **[AI_GUIDELINES.md](./AI_GUIDELINES.md)** and **[CLAUDE.md](./CLAUDE.md)** first.

---

## What is on the site

**Landing page (`/`)**
- Opening calibration sequence, once per browser session, synced to `window.load` with a hard 2 s ceiling and a bypass key.
- Interactive constellation sky rendered with Threlte and custom GLSL. The pointer reveals the nearest figure; the HUD in the corner names it with its coordinates.
- Device tiering decided before any WebGL is downloaded: `full`, `lite`, or a CSS-only `static` starfield. The Three.js bundle is a lazy chunk that the static tier never requests. An FPS watchdog and a WebGL context-loss guard downgrade at runtime.
- About with a hover-swap portrait (illustration first, formal photo on hover or tap), Skills with a per-technology inspector, four featured projects plus a "currently building" card, and Contact with availability, a resume modal and real engine telemetry (tier, FPS, cores, memory, network, build date).
- Side rail navigation on wide screens, a command palette on Ctrl+K, and two themes (Tactical dark, Archive light) stamped on `<html>` before first paint.

**Projects (`/projects`, `/projects/[slug]`)**
- Search across title, summary and stack, filter by kind, six per page, and a prerendered detail page per project.

**Engineering Journal (`/blog`, `/blog/[slug]`)**
- Markdown posts parsed on the server only; the browser receives prerendered HTML and `__data.json`, never the markdown corpus.
- Home, Categories, Tags and Archive views, each with its own URL so the back button and deep links work.
- Reader with table of contents and scroll-spy, Prism highlighting with copy buttons, Mermaid diagrams that follow the theme, prev/next navigation, per-post Open Graph tags and `lang="id"`.

**Under the hood**
- `robots.txt`, a `sitemap.xml` generated at build time, absolute Open Graph images, and a 1200x630 social card at `static/og-preview.png`.
- Reduced-motion is honoured everywhere: Lenis is skipped, GSAP contexts are built with `gsap.matchMedia`, and CSS animations collapse to zero.

---

## Design system in one screen

- **Tokens** live in `src/app.css` as `--tactical-*` (site) and `--blog-*` (journal) variables, with a dark and a light set. Components use the variables, never raw hex.
- **Type**: three families only. Epilogue for headings, buttons and labels, Plus Jakarta Sans for reading text, Fira Code for mono labels and code. The smallest text size is 11px (`text-label`).
- **Shape**: no rounded corners, no shadows, hairline borders, accent corner reticles on hover, a 3px cross grid as the page texture.
- **Motion**: every GSAP call uses the vocabulary in `src/lib/motion.js` (`dur`, `ease`, `stagger`, `media`). Sections reveal once. Tweens live in `gsap.context` and are reverted on unmount.
- **Honesty**: HUD labels show real values or nothing. No decorative "latency" or "version" strings.

---

## Directory structure

```
src/
├── app.css                      # Tailwind v4 theme, tokens, grid, focus ring, prism themes
├── app.html                     # Document shell, theme stamp, boot cover
├── hooks.server.js              # lang="id" for /blog routes at prerender time
├── posts/                       # Journal articles, YYYY-MM-DD-slug.md
├── lib/
│   ├── content/site.js          # ALL landing-page copy, projects, skills, contact, resume
│   ├── motion.js                # Shared easing, duration, stagger and media queries
│   ├── blog/posts.js            # Markdown parser and renderer (server only)
│   ├── blog/blogTheme.js        # Journal theme store
│   ├── components/
│   │   ├── Hero.svelte, HeroName, HeroCanvas, StaticHero, hero/Constellations.svelte
│   │   ├── intro/IntroCalibration.svelte
│   │   ├── About, PortraitSwap, SnakePlaceholder, StatsTelemetry
│   │   ├── Skills, Portfolio, CurrentlyBuilding, ProjectModal
│   │   ├── Contact, ResumeModal, SiteTelemetry
│   │   ├── SideNav, CornerTelemetry, LiveClock, ThemeToggle, CommandPalette, Section
│   ├── scroll/                  # heroTransition.js, sectionAnim.js, smoothScroll.js
│   ├── stores/                  # theme.svelte.js, constellation.svelte.js
│   ├── three/                   # Constellation geometry and GLSL shaders
│   ├── data/                    # IAU constellation lines and names
│   ├── utils/device.js          # Tier detection, reduced-motion helper
│   └── actions/portal.js
└── routes/
    ├── +layout.svelte           # Fonts and global CSS
    ├── (site)/+layout.svelte    # Nav chrome, palette, view transitions, OG tags
    ├── (site)/+page.svelte      # Landing page
    ├── (site)/blog/             # +page.server.js, +page.svelte, [slug]/
    ├── (site)/projects/         # +page.js, +page.svelte, [slug]/
    └── sitemap.xml/+server.js
static/
├── og-preview.png               # Social card (1200x630)
├── robots.txt
├── favicon.svg, favicon-dark.svg, favicon-light.svg
├── cv-suryatmaja.pdf            # Resume served by the Contact modal
├── projects/                    # Project diagrams referenced from site.js
└── assets/img/posts/            # Journal images, one folder per post
```

---

## Deployment

The build is a static folder. All three hosts serve the same `build/` output.

**GitHub Pages.** `.github/workflows/deploy.yml` builds and uploads on every push to `main`. One-time setup: repository Settings, Pages, Source: GitHub Actions. For an apex domain add `static/CNAME` containing the hostname.

**nginx on a VM (for example AWS EC2).** Install Node 20 and nginx, clone, `npm ci && npm run build`, and point a server block at `build/`. Reuse the location rules from `nginx.conf` in this repo: list routes are emitted as `blog.html` and `projects.html` beside a same-named directory, and `__data.json` files must be served as plain static files.

```nginx
server {
    server_name suryatmaja.dev www.suryatmaja.dev;
    root /var/www/portfolio/build;
    index index.html;
    location ~ ^(?<base>.+)/$ { try_files $base.html $uri $uri/ /404.html; }
    location / { try_files $uri $uri.html $uri/ /404.html; }
    location /_app/immutable/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location /assets/ { expires 30d; add_header Cache-Control "public"; }
}
```

**Homelab container.** `Dockerfile` (multi-stage, nginx:alpine runtime), `nginx.conf` and `docker-compose.yml` are in the repo. The compose service listens on port 3080 and joins the external `shared_net` network for a reverse proxy.

```bash
docker compose up -d --build
```

Expose it with a Cloudflare Tunnel or keep it private with `tailscale serve --bg 3080`.

---

## Rules for contributors and AI agents

- Content lives in `src/lib/content/site.js` and `src/posts/`, never hardcoded in components.
- Run `npm run build` before every commit. It must exit 0.
- Record code changes in `CHANGELOG.md` before committing.
- Commits are authored by the repository owner only. No AI co-authors, ever.
- Confirm with the owner before committing or pushing changes that affect the live site (see `CLAUDE.md`).
- Conventional Commits: `feat`, `fix`, `docs`, `refactor`, `perf`, `chore`, `content`.

---

## License

© 2026 Bakti Surya Atmaja. All rights reserved. Source code, design and articles are proprietary unless stated otherwise.
