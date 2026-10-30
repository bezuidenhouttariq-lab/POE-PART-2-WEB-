# Paws & Purpose Animal Rescue — Website

## Project Title
Paws & Purpose Animal Rescue — Non-Profit Website (Part 3: Enhancing Functionality and SEO)

## Student Information
- Name: Tariq Bezuidenhout
- Student Number: ST10514579
- Group: 2
- Subject: Web and Emerging Development Environments (WEDE)

## Live Site and Repository
- **Live site:** https://paws-purpose-rescue.netlify.app  *(update if your Netlify URL differs)*
- **Repository:** https://github.com/bezuidenhouttariq-lab/POE-PART-2-WEB-

## Project Overview
Paws & Purpose Animal Rescue is a non-profit organisation, founded in 2018 in Johannesburg South, that rescues, rehabilitates and rehomes abandoned and abused dogs and cats. This repository contains the HTML/CSS/JS build for its website, submitted across three parts of the Proof of Evidence (PoE).

Part 1 originally explored a bakery concept; following lecturer feedback the project moved to **Proposal 2: Paws & Purpose Animal Rescue** during Part 2.

## Website Goals and Objectives
- Increase enquiries from prospective adopters.
- Grow the monthly donor and sponsor base.
- Recruit new volunteers for shelter and foster care duties.
- Raise awareness of ongoing intake and resource needs.

## Key Features (Part 3)
| Requirement | Where it is |
|---|---|
| Accordion | FAQ on `services.html` (jQuery, ARIA-compliant) |
| Tabs | Volunteer / Foster / Sponsor on `services.html` (jQuery, arrow-key navigation) |
| Modal | Animal profile dialog on `services.html` (native `<dialog>`, share buttons) |
| Interactive map | `contact.html` — Leaflet + OpenStreetMap, popups, "find my nearest location" (Geolocation API) |
| Animations & transitions | CSS transitions, scroll-reveal (IntersectionObserver), animated counters, modal/lightbox animations; respects `prefers-reduced-motion` |
| Advanced DOM manipulation | Cards, modal, lightbox, toasts, back-to-top button, error summaries and result panels all built with DOM methods |
| Gallery + lightbox | `about.html` — keyboard, arrow-key and swipe support |
| Dynamic content | Animal listing rendered by JS from `js/animals-data.js` |
| Search, filter, sort | Adopt page: text search, dog/cat filter, 4 sort orders; state kept in the URL |
| Forms | `enquiry.html` and `contact.html` — see below |

### Forms
- **enquiry.html** — adopt / volunteer / sponsor / general. Fields change with the type. After validation the input is *processed* and the visitor sees an instant answer: animal availability and adoption fee, volunteer orientation date (next first Saturday), or sponsorship cost per month/year.
- **contact.html** — general message: name, email, phone, message type, subject, full message. After validation the data is compiled into an email (preview shown) and sent to the recipient set in `js/contact.js` (`RECIPIENT`) via the visitor's email app, with a copy-to-clipboard option.
- **Validation** (`js/forms-core.js`): names, email, South African phone numbers, dates (real date, not past, within 60 days, not Sunday), text length limits, required selects and consent. Inline errors, error summary, `aria-invalid`, live character counters.
- **AJAX**: forms submit with `fetch()` (no page reload). On Netlify the data is captured by Netlify Forms; if the request fails the user sees a clear message and can retry.
- **Spam/security**: honeypot field; user input only inserted with `textContent`; no banking data collected.

## SEO
**Keyword research** (primary → supporting): *animal rescue Johannesburg South*; *adopt a dog Johannesburg*; *adopt a cat Johannesburg*; *volunteer animal shelter Johannesburg*; *sponsor a rescue animal*; *no-kill shelter Rosettenville*.

### On-page
- **Title tags & meta descriptions:** unique per page, ≤ 60 / ≤ 160 characters, keyword-led.
- **Headings:** one `<h1>` per page, logical `h2`–`h4` hierarchy (verified with axe).
- **Images:** descriptive file names (`community-open-shelter-day-800.jpg`, `images/gallery/...`), meaningful `alt` text, `width`/`height` set, `loading="lazy"`, responsive `srcset`.
- **URLs:** short, lowercase, flat (`/services.html`, `/enquiry.html`); canonical tags on every page.
- **Internal linking:** breadcrumbs, contextual links in body copy, "ways to help" section, footer links.
- **Mobile-friendly:** responsive layout, viewport meta, tap-sized buttons, tested at 390px.
- **Structured data (JSON-LD):** `AnimalShelter` (address, geo, opening hours), `WebSite`, `BreadcrumbList`, `ContactPage`; Open Graph and Twitter cards for social sharing.

### Off-page (strategy — actions to carry out once the site is live)
- **Backlinks:** request listings from local SPCA/animal-welfare directories, Johannesburg community Facebook groups and news sites, local vet clinics (partner: City & Suburban Veterinary Clinic), pet-food sponsors and university societies.
- **Social media:** share adoptable animals weekly (WhatsApp / Facebook share buttons are built into each animal profile); use the Open Graph card for rich previews; link site from Facebook and Instagram bios.
- **Local SEO:** claim a Google Business Profile with the Rosettenville address and hours (matching the schema markup); gather reviews from adopters; list on OpenStreetMap-based and local directories with identical name/address/hours.

### Additional
- `robots.txt` and `sitemap.xml` at the site root.
- **Speed:** no build-time bloat; local vendor libraries (no third-party script CDNs), `defer` on all scripts, Leaflet loaded only on the contact page and jQuery only on the adopt page, SVG artwork, font preconnect + `display=swap`, cache headers (`_headers`).
- **Security:** Content-Security-Policy (meta tag + `_headers`), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS (Netlify serves HTTPS), `rel="noopener noreferrer"` on external links, honeypot, safe DOM insertion.

## Sitemap
See `images/site-structure-sitemap.svg`.
```
Home (index.html)
├── About (about.html)  — includes gallery
├── Adopt & Get Involved (services.html)
├── Enquire (enquiry.html)
└── Contact (contact.html)
(+ thanks.html, 404.html utility pages)
```

## Folder Structure
```
├── index.html, about.html, services.html, enquiry.html, contact.html, thanks.html, 404.html
├── robots.txt, sitemap.xml, _headers, netlify.toml
├── css/style.css
├── js/   script.js · animals-data.js · animals-ui.js · adopt-page.js · gallery.js
│         map.js · forms-core.js · enquiry.js · contact.js
├── vendor/  jquery/ · leaflet/   (self-hosted, with licences)
└── images/  (gallery/, screenshots/, og-image.png, favicon.svg, ...)
```

## Deployment
Deployed on Netlify (publish directory = repository root, no build command). Any push to `main` redeploys.

## Changelog

### Part 3 — feedback corrections from Part 2
> **TODO (student):** add the lecturer's Part 2 feedback points here and describe how each was addressed.

Self-review corrections made while preparing Part 3:
- **2026-10-30** — Moved the site from a doubly-nested folder to the repository root so it can be deployed (`index.html` is now at the root).
- **2026-10-30** — Corrected the README: removed the reference to a bakery folder that is not in this repository and replaced "planned for Part 3" notes with what is now built.
- **2026-10-30** — Accessibility: darkened the sage accent used for text/buttons (`#6d8564` → `#52694b`) and the CTA/step backgrounds because white-on-sage failed WCAG AA contrast; fixed low-contrast footer text.
- **2026-10-30** — Accessibility: added a skip-to-content link, fixed heading order (footer headings, About page), added table `th` scope on opening hours.
- **2026-10-30** — Removed inline `style` attributes in favour of CSS classes (needed for a strict Content-Security-Policy).
- **2026-10-30** — Corrected the map: the Part 2 pin pointed to the wrong part of Johannesburg; replaced with an interactive map using approximate Rosettenville and City & Suburban coordinates.
- **2026-10-30** — Renamed images descriptively (`shelter-day-*` → `community-open-shelter-day-*`, `sitemap.svg` → `site-structure-sitemap.svg`).

### Part 3 — new work
- **2026-10-30** — Added `js/animals-data.js` and dynamic animal listing with search, filter and sort (adopt page).
- **2026-10-30** — Added animal profile modal, FAQ accordion and tabbed "Get involved" section (jQuery).
- **2026-10-30** — Added Leaflet interactive map with popups, directions and nearest-location feature.
- **2026-10-30** — Added gallery with lightbox (About page), scroll animations, animated counters, back-to-top button and toast messages.
- **2026-10-30** — Built enquiry form with conditional fields, validation, AJAX submission and instant cost/availability response.
- **2026-10-30** — Built contact form with validation, AJAX submission and compiled email (mailto + copy).
- **2026-10-30** — SEO: unique titles/descriptions, canonical URLs, Open Graph/Twitter, JSON-LD, breadcrumbs, internal links, `robots.txt`, `sitemap.xml`, favicon and share image.
- **2026-10-30** — Security & speed: Content-Security-Policy, security headers, cache headers, self-hosted libraries, deferred scripts.
- **2026-10-30** — Added `thanks.html` (no-JS form fallback) and `404.html`.

## References
- Nielsen Norman Group. Web usability and navigation design guidelines. nngroup.com.
- W3C. HTML5, CSS3 and WCAG 2.2 documentation. w3.org.
- MDN Web Docs. `<dialog>`, Fetch API, IntersectionObserver, Geolocation API, Constraint Validation, CSS Grid/Flexbox, responsive images. developer.mozilla.org.
- WAI-ARIA Authoring Practices Guide — Tabs and Accordion patterns. w3.org/WAI/ARIA/apg.
- jQuery 3.7.1 (MIT licence). jquery.com.
- Leaflet 1.9.4 (BSD-2 licence). leafletjs.com. Map data © OpenStreetMap contributors (ODbL), openstreetmap.org.
- Google Search Central. SEO starter guide; structured data documentation. developers.google.com/search.
- schema.org. `AnimalShelter`, `BreadcrumbList`, `ContactPage`. schema.org.
- Netlify Docs. Forms setup, headers and deploys. docs.netlify.com.
- Google Fonts. Quicksand and Inter. fonts.google.com.
- Sitemaps.org protocol and robots.txt specification (RFC 9309).

## Use of AI
Generative AI (Claude, by Anthropic) was used to help plan, write and test the Part 3 code and documentation, in line with the assignment's permission to use AI. All output was reviewed, tested in a browser, and is submitted by the student, who remains responsible for the work.

## Notes on content
Adoption fees, sponsorship amounts, policies, team members and the street addresses are illustrative content for a fictional organisation. Map pins are approximate. Illustrations stand in for real photography.
