This folder is where real shelter/animal photography goes.

For Part 2, the site uses hand-built SVG illustrations for the hero and the animal
grid, and a set of illustrated placeholder JPGs (shelter-day-480/800/1200.jpg) to
demonstrate the responsive <picture>/srcset technique, since sourcing images
legally and preparing them is one of this assignment's own learning outcomes.

Suggested legal sources for real adoption/shelter photography:
- Unsplash (unsplash.com) — free license, no attribution required
- Pexels (pexels.com) — free license, no attribution required
- Pixabay (pixabay.com) — free license, check individual image terms
- Your own phone photos of real (or willing friends'/family's) pets, with permission

Suggested free tools for preparing images (resizing/compressing/cropping for the web):
- Squoosh (squoosh.app) — compression and format conversion (e.g. to WebP)
- Canva (canva.com) — cropping, simple edits
- TinyPNG (tinypng.com) — quick compression before upload

When you replace a placeholder, export each real photo at three widths so the
existing srcset markup keeps working, e.g.:
  images/shelter-day-480.jpg   (mobile)
  images/shelter-day-800.jpg   (tablet)
  images/shelter-day-1200.jpg  (desktop)

Recommended naming convention for new animal photos:
  images/animal-buddy.jpg
  images/animal-miso.jpg
  images/team-thandi.jpg
