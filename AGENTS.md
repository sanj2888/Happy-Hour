# AGENTS.md

Guidance for AI coding agents working on this repo.

- The owner is not a developer. Explain things in plain English with click-by-click steps.
- Keep it free: no paid services, plans or API keys.
- One page, no build step: `index.html` (plain JavaScript, no frameworks) and `venues.js` (the venue list the owner edits in GitHub's editor). Don't add npm, a bundler or a framework without asking.
- Only add venues with a real source link, known days and times, and a `checked` date. Never make up deals, times or venues; skip a venue if a detail is missing. Members-only club deals are included with `members: true`, which shows a "Members only" label.
- `lat`/`lon` are approximate (from the street address or suburb), so the app rounds distances ("about 2 km away"). Directions search Google Maps by name and suburb.
- Look: fun and bold for 18–35s, a neon night-out theme (always dark, pink and cyan glows, Unbounded headings, emoji welcome). Colours are CSS variables in `:root`. `thumbnail.png` is the link preview (1200×630).
- Cities for now: Sydney and Melbourne (`CITIES` in `index.html`).
- `data/` holds the Greater Sydney research as two CSVs (venues and happy-hour sessions) with verification status; see `data/README.md`. Sessions marked `Listed (partial)` are not added to the app.
- Before pushing, open the page in Chromium (Playwright) at phone width (390px), in light and dark mode, and check there are no console errors.
- New suburbs need a region in `REGIONS` in `index.html` (for the Plan ahead area picker); unmapped suburbs fall under "Other areas".
- Saved spots live only on each phone (localStorage `happy-hour-saved`). `sw.js` caches the app network-first so it opens with poor signal.
- Near me also lists other bars, pubs, nightclubs and beer gardens within 2 km from OpenStreetMap's free Overpass API (no key), under the happy hours. Places already in `venues.js` are left out; any OSM `happy_hours` tag is shown. Results are cached per location for the session.
- The Map tab loads Leaflet 1.9.4 from cdnjs only when opened, with CARTO dark tiles (free, OpenStreetMap data, attribution kept). It uses the Right now filters. Happy hours with 30 minutes or less left show "Last call" (`LAST_CALL`).
- Search is the main way in: the box above the tabs suggests suburbs (both cities) and bars. Picking a suburb shows happy hours around it, closest first (`state.focus`, cleared by the pink "📍 Suburb ✕" chip). Any other place is looked up on OpenStreetMap's free Nominatim search (on Enter or the 🧭 suggestion; one request per search, no key).
