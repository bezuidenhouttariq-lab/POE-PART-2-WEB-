# Paws & Purpose Animal Rescue — Website

## Project Title
Paws & Purpose Animal Rescue — Non-Profit Website (Part 2: Designing the Visuals — CSS Styling and Responsive Design)

## Student Information
- Name: Tariq Bezuidenhout
- Student Number: ST10514579
- Group: 2
- Subject: Web and Emerging Development Environments (WEDE)

## Project Overview
Paws & Purpose Animal Rescue is a non-profit organisation, founded in 2018 in
Johannesburg South, that rescues, rehabilitates, and rehomes abandoned and abused
dogs and cats. This repository contains the HTML/CSS/JS build for its website,
submitted as part of the subject's Proof of Evidence (PoE) across three parts.

**Note on proposal choice:** Part 1 originally developed the Hearth & Honey Artisan
Bakery concept (see `hearth-honey-bakery/` elsewhere in this repository). Following
lecturer feedback on the Part 1 submission, which recommended proceeding with
**Proposal 2: Paws & Purpose Animal Rescue** for its stronger fit with the module's
technical outcomes (a photo-led animal grid for Flexbox/Grid practice, and a
multi-purpose enquiry form for Part 3's JavaScript validation), development moved
to this site. The initial HTML structure for Paws & Purpose was built at the start
of Part 2, alongside the CSS styling and responsive design this part requires, and
both are logged in the changelog below.

The rescue currently operates only through a Facebook page. This project replaces
that with a five-page site: a homepage, an about page, an adoption/animal listing
page, a multi-purpose enquiry form, and a contact page with the shelter's location
and hours.

## Website Goals and Objectives
- Increase enquiries from prospective adopters.
- Grow the monthly donor and sponsor base.
- Recruit new volunteers for shelter and foster care duties.
- Raise awareness of ongoing intake and resource needs.

**KPIs:** adoption enquiry form submissions per month, growth in recurring
donor/sponsor sign-ups, volunteer applications received, and newsletter subscriber
growth (see the full Website Project Proposal document for detail).

## Key Features and Functionality
- Fully responsive, mobile-first layout (phones, tablets, desktops), with a
  hamburger menu on small screens.
- Photo-led animal adoption grid built with CSS Grid, using illustrated
  placeholders pending real shelter photography.
- A numbered, four-step adoption process section (Browse & enquire → Meet & greet
  → Home check → Take them home).
- A single multi-purpose enquiry form covering adoption, volunteering, and
  sponsorship enquiries (`enquiry.html`); client-side validation is planned for
  Part 3.
- Contact page with the main shelter and a satellite intake point, trading hours,
  and an embedded OpenStreetMap map.
- A responsive `<picture>`/`srcset` example on the About page, serving three image
  widths (480/800/1200px) for the community open-day photo placeholder.
- Consistent sticky navigation, visible keyboard focus states, and hover/active
  states across every interactive element.

## Timeline and Milestones
| Part | Focus | Status |
|------|-------|--------|
| Part 1 | Project initiation, proposals, sitemap | Complete (bakery proposal originally taken forward) |
| Part 2 | Pivot to the approved non-profit proposal; initial HTML structure; CSS styling; responsive design | Complete |
| Part 3 | Form functionality, cross-browser testing, final submission | Upcoming |

## Sitemap
See `images/sitemap.svg` for the visual sitemap. In outline form:

```
Home (index.html)
├── About (about.html)
├── Adopt & Get Involved (services.html)
├── Enquire (enquiry.html)
└── Contact (contact.html)
```

## Responsive Design Notes
- **Breakpoints:** desktop (default, >1024px), tablet (≤1024px), mobile (≤640px),
  implemented with `max-width` media queries in `css/style.css`.
- **Relative units:** `rem`/`em` are used throughout for spacing and type
  (see the `--space-*` tokens and the `clamp()` type scale); `%` and `fr` units
  are used for grid/flex widths so components resize with their container.
- **Responsive images:** the About page's community photo uses `<picture>` with a
  `srcset`/`sizes` pair across three widths — see `images/shelter-day-*.jpg`.
- **Screenshot evidence** (desktop/tablet/mobile) is included in
  `images/screenshots/`. These were captured with headless Chromium at 1440px,
  800px, and 390px as a first pass — please add your own browser-dev-tools and/or
  real-device screenshots for the other pages before final submission, per the
  brief's requirement to test on multiple actual devices.

## Changelog
- **2026-09-17** — Pivoted the project to Proposal 2 (Paws & Purpose Animal
  Rescue) per lecturer feedback on the Part 1 submission. Built the initial
  five-page HTML structure (`index`, `about`, `services`, `enquiry`, `contact`)
  with consistent semantic markup and navigation, since this proposal had not
  previously been developed beyond the written proposal document.
- **2026-09-17** — Created an external stylesheet (`css/style.css`) and linked it
  to all five pages; added a CSS reset and a base style (colour, typography, and
  spacing custom properties in `:root`) for consistency across the site.
- **2026-09-17** — Applied the approved design direction: sage green
  (`#8fa37e`), warm sand (`#efe7d8`), and charcoal text (`#332e2a`), with
  Quicksand for headings and Inter for body copy.
- **2026-09-17** — Built the desktop layout using CSS Grid (photo-led animal
  cards, stat strip, footer columns) and Flexbox (header, hero actions, tag
  groups, form radio group).
- **2026-09-17** — Added interactive states (`:hover`, `:focus-visible`,
  `:active`) to buttons, nav links, and form fields, and a distinct focus-ring
  colour so keyboard focus stays visible against every background.
- **2026-09-17** — Implemented responsive design: breakpoints at 1024px and
  640px, a mobile hamburger menu (`js/script.js`), relative units (`rem`/`em`/`%`)
  throughout, and a `<picture>`/`srcset` responsive image example on the About
  page.
- **2026-09-17** — Added `images/screenshots/` with initial desktop/tablet/mobile
  evidence, updated this README with the Part 2 changelog and references, and
  added `images/README.txt` with guidance for sourcing real shelter photography.
- **2026-09-17** — Aesthetic refinement pass: added an organic blob shape and a
  floating stat badge to the hero, wave-shaped SVG dividers between sections
  (instead of hard rectangle edges), a subtle paw-print texture in the hero and
  stat strip, and a new flat `.panel` component (icon + colour-accented left
  border) for the mission/vision, volunteering, and sponsorship sections, so the
  page isn't built from one repeated card style throughout.

## References
- Nielsen Norman Group. Web usability and navigation design guidelines. Available at: nngroup.com.
- W3C. HTML5 and CSS3 standards documentation. Available at: w3.org.
- MDN Web Docs. CSS Grid Layout, Flexbox, and responsive images (`picture`,
  `srcset`). Available at: developer.mozilla.org.
- Google Fonts. Quicksand and Inter typefaces. Available at: fonts.google.com.
- OpenStreetMap. Embeddable map service used on the Contact page. Available at: openstreetmap.org.

## Folder Structure
```
paws-purpose-rescue/
├── index.html
├── about.html
├── services.html
├── enquiry.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── images/
    ├── sitemap.svg
    ├── README.txt              (guidance on sourcing real photography)
    ├── shelter-day-480.jpg     (responsive image demo — mobile width)
    ├── shelter-day-800.jpg     (responsive image demo — tablet width)
    ├── shelter-day-1200.jpg    (responsive image demo — desktop width)
    └── screenshots/            (responsive-testing evidence)
```
