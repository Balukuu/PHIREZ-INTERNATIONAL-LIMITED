# Phirez International Limited — Website Handover Notes

This site was built as a static HTML/CSS/JS project (no build step) so it can be deployed to Netlify, Vercel, GitHub Pages, or standard cPanel hosting by uploading the folder as-is.

## 0. 2026-09-09 — Redesign merge + content/consistency fixes

A separate "Optron-style" redesign (top utility bar, horizontal desktop nav, orange accent, editorial case-study cards) was merged in from the GitHub remote and landed on 6 of 12 pages only, plus introduced **fabricated case-study statistics** (invented accuracy/efficiency percentages, equipment claims with no supporting data) presented as "real case studies." Both were fixed in the same pass:
- **Content integrity:** `projects.html`'s five case studies and the matching homepage teasers were rewritten to remove invented numbers (e.g. "1.5% accuracy," "18% fertilizer reduction," "zero utility strikes") and reframed honestly as illustrative capability examples, matching the "not tied to a specific client" framing used elsewhere on the site. The page title/meta no longer claims "real case studies." The homepage's "10+ partner brands" stat was corrected to 9 (matching what's actually shown).
- **Header/nav/footer unified across all 12 pages** — the redesign's top-bar + desktop-nav + full mega-menu overlay (previously only on `index.html`, with a flattened nav-list on 5 other pages and the old full-screen-only nav on the remaining 5) is now identical everywhere, including `gallery.html`, `contact.html`, `404.html`, `privacy.html`, `terms.html`. "Field Gallery" was added to the desktop nav (previously only reachable via the hamburger menu).
- **Broken anchors fixed:** `company.html#team`/`#vision` (renamed to `#divisions`/`#values` by the redesign) and stale `solutions.html` anchor names were the two recurring breakages — both are now consistent site-wide.
- **Dead code removed:** the Swiper.js carousel library (CDN `<link>`/`<script>` + its JS init block) was fully removed — the redesign deleted the only carousel markup that used it but left the ~150KB dependency loading on 6 pages. Several unused CSS selectors/tokens from the redesign were also removed (`.hover-arrow-parent`, `.btn-outline-orange`, `.optron-link.dark-text`, `--border-dark-hover`, the duplicate `.btn-outline-accent`), and the now-fully-dead standalone `.site-header` fixed-position CSS was dropped now that every page nests it inside `.header-wrapper`.
- **Not done (deferred):** three near-duplicate dark-card component systems (`.card-dark`+`.icon-tile`, `.brand-card-optron`, `.optron-service-box`) and two pill/badge systems (`.eyebrow`, `.optron-pill`) still coexist — consolidating them is a larger design-system refactor that wasn't attempted here to avoid visual regressions across dozens of usages without a full visual QA pass.

## 1. Blockers — must be resolved before launch

1. **Domain.** `phirez.com` currently redirects to a GoDaddy "domain for sale" parking page. It must be renewed/reclaimed and pointed at the new hosting before this site goes live.
2. **Contact form endpoint.** [contact.html](contact.html) posts to `https://formspree.io/f/YOUR_FORM_ID` — a placeholder. The form's JS (validation, fetch, success/error states) is fully wired and Formspree-compatible; you only need to create a free/paid [Formspree](https://formspree.io) account (or swap in EmailJS / a serverless function) and replace `YOUR_FORM_ID` in the `<form action="...">` attribute with the real endpoint, and set it to deliver to `info@phirez.com`. Until this is done, the form will fail silently with the "Something went wrong" error state.
3. **Analytics.** No Google Analytics/Plausible property ID was supplied. A commented-out GA4 snippet is in the `<head>` of every page with a `GA_MEASUREMENT_ID` placeholder — uncomment it and replace the ID once you have a property, or swap in Plausible/another provider.

## 2. Content placeholders (clearly marked on the page itself)

These sections are functional and styled, but use honest placeholder copy because the source company profile didn't supply the real content:

- **Team ([company.html#divisions](company.html#divisions))** — no headshots/bios were supplied.
- **Careers ([company.html#careers](company.html#careers))** — no open roles were supplied, so this is a simple "send your CV" prompt rather than a fake job board.
- **Case studies ([projects.html](projects.html))** — the source material gave client *logos* but no named, attributable projects. Five "Capability Spotlight" cards are used instead, explicitly labeled as illustrative and not tied to a specific client, each backed by real gallery photography. Real case studies (with a client quote and named project details) would meaningfully strengthen this page.
- **Office hours ([contact.html](contact.html))** — defaulted to Mon–Fri, 8:30am–5:30pm (EAT) and flagged in the UI as a placeholder pending confirmation.
- **Privacy Policy & Terms of Service** ([privacy.html](privacy.html), [terms.html](terms.html)) — reasonable boilerplate, each carrying an on-page banner noting it needs formal legal review before being relied upon.
- **Social media links** — the Facebook/X/LinkedIn icons in the navigation overlay and on the contact page link to `#` placeholders, since no real profile URLs were supplied. Add the real URLs (or remove the icons) before launch.
- **Client logo wall ([projects.html](projects.html), homepage marquee)** — client names are rendered as styled text (no logo image files were supplied). Per the source brief, some client names/acronyms were only partially legible in the original scan — please verify the full list against your own records before publishing.

## 3. Design decisions worth knowing about

- **Imagery.** A [gallery.html](gallery.html) page was added with 16 real field photos (GNSS/survey work, drone mapping, precision-agriculture demos, industry events), sourced from the company's own KACO Systems archive (`kaco.ug/gallery`) and optimized/re-compressed into `assets/images/gallery/` (full-size) and `assets/images/gallery/thumbs/` (grid thumbnails). It's linked from the main nav, the footer, a homepage teaser strip, and two of the `projects.html` illustrative vignettes. Hero sections still use the abstract topographic-line motif rather than a single photo — `.hero-bg` / `.topo-bg` containers can take a plain `<img>` in its place if a suitable wide-format hero photo becomes available. The gallery still doesn't cover the IT-infrastructure side of the business (network/server work) — worth adding photos for that if/when available.
- **Logo.** No official logo file was supplied. A placeholder compass mark + "Phirez." wordmark was designed in the brand colors (`assets/images/favicon.svg` and inline in the header/footer). Replace with the real logo if one exists.
- **Navigation.** Every page shares one header: a top utility bar (address/phone/social), a persistent desktop nav (≥1080px), and a hamburger-triggered full-screen overlay with mega-panels for Solutions/Services/Company drill-down — same interaction pattern as Optron, reflows at every breakpoint, and stays keyboard- and screen-reader-operable throughout.
- **URLs.** Pages are flat files at the root (`/solutions.html`, `/contact.html`, etc.) rather than folder-based extensionless URLs (`/solutions/`). This is still descriptive and human-readable and needs no server configuration. If you'd prefer extensionless URLs, that's a small follow-up (either move each page into its own folder as `index.html`, or add a hosting-level rewrite rule).
- **Industries count.** The brief listed 8 "Industries Served" as a homepage stat but gave 9 industry descriptions with an option to combine the last two. They're combined into one card ("Education & Research / Disaster Management & Humanitarian Agencies") so the "8 Industries Served" figure stays accurate everywhere it's cited.
- **Map embed.** [contact.html](contact.html) uses Google's keyless `maps.google.com/maps?q=...&output=embed` technique, pinned by address search rather than exact coordinates. It works without an API key or billing account. Automated testing in a headless browser could not fully confirm map tiles render (Google's embed sometimes withholds tiles from bot/headless requests) — please double-check it in a normal browser after deploying. For a pinpoint-accurate marker, consider getting a Google Maps API key later.

## 4. Stats used on the homepage

The brief's Optron-style stat row asks for figures like "150+ projects" or "98% satisfaction" that aren't supported by anything in the Phirez company profile. Only defensible, derivable figures were used instead:
- 15+ Years of Experience (2011–present)
- Esri Silver Partner · Trimble Authorised Distributor
- 8 Industries Served
- 20+ Institutional Clients (counted from the supplied client list)

## 5. Technical notes

- **Stack:** plain HTML/CSS/JS, no build step. Fonts (Google Fonts) and the map load from public CDNs at runtime — an internet connection is required (no offline fallback bundled, which is standard for a site like this).
- **Progressive enhancement:** with JavaScript disabled, all content remains visible and readable (stat numbers show their real value instead of "0", the logo marquee sits still instead of animating oddly, fade-in reveals show fully visible content). The navigation overlay, carousel controls, and count-up animation require JS, same as the Optron reference site.
- **Performance:** no heavy images are used (icons are inline SVG; the only raster images are a ~80KB Open Graph share image and small favicons), so the site should load quickly on typical hosting. A full Lighthouse audit could not be run in this environment (no Node/Chrome DevTools tooling available) — run one after deploying to confirm Core Web Vitals in a real network environment.
- **SEO:** every page has a unique title/meta description, Open Graph + Twitter Card tags, canonical URL, and semantic heading hierarchy. `Organization`/`LocalBusiness` JSON-LD (with NAP matching the Contact page) is on the homepage and Contact page. `sitemap.xml` and `robots.txt` are included at the root.
- **Accessibility:** color pairs were checked against WCAG AA contrast (4.5:1 for body text, 3:1 for large text/UI components); all interactive elements are keyboard-reachable with visible focus rings; the nav overlay and mega-panels are operable via keyboard (Tab/Enter/Escape) and screen readers (ARIA states on the menu trigger and panels).

## 6. Before you publish

- [ ] Reclaim/renew `phirez.com` and point it at hosting
- [ ] Replace the Formspree placeholder in `contact.html` with a real endpoint and test that a submission actually reaches `info@phirez.com`
- [ ] Add a real Analytics property ID (or remove the commented snippet if not wanted yet)
- [ ] Supply team headshots/bios, real social media URLs, and (ideally) 2–3 real case studies
- [ ] Have legal review `privacy.html` and `terms.html`
- [ ] Confirm office hours and the full client list
- [ ] Supply the official logo file, if/when available (real field photography is now in [gallery.html](gallery.html))
