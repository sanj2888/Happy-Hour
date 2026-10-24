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
- The Map tab loads Leaflet 1.9.4 from cdnjs only when opened, with OpenStreetMap's own tiles (free, no key; darkened with a CSS filter on `.leaflet-tile-pane`, attribution kept). CARTO tiles now need a key, so don't use them. It uses the Right now filters. Happy hours with 30 minutes or less left show "Last call" (`LAST_CALL`).
- Search is the main way in: the box above the tabs suggests suburbs (both cities) and bars. Picking a suburb shows happy hours around it, closest first (`state.focus`, cleared by the pink "📍 Suburb ✕" chip). Any other place is looked up on OpenStreetMap's free Nominatim search (on Enter or the 🧭 suggestion; one request per search, no key).
- Map pins close together join into numbered bubbles (Leaflet.markercluster 1.5.3 from cdnjs, loaded after Leaflet; the map still works without it). Bubbles glow green if any pin inside is on now.
- Filters: 🌙 Late (runs past 9 pm, `LATE_FROM`) and 💸 $10 max (the deal mentions a price of $10 or less, `CHEAP_MAX`) sit in both panels. On now also lists "Starting within the hour" (`SOON_MINS`).
- Cards show "Wrong deal?" (a pre-filled GitHub issue) and warn "may have changed" when `checked` is over 180 days old (`OLD_AFTER_DAYS`).
- Shared links are `?bar=Name&city=City` and open straight to that bar.
- 🚶 Crawl (next to Pick for me, Right now tab) plans a bar crawl: pick 2–5 bars and it builds a timed walking route (`planCrawl`). Each stop is `STOP_MINS` (45) apart, a bar is only used if its happy hour is on when you'd arrive (and 20 minutes after), hops are at most `HOP_KM` (1.5 km). It starts near you, the searched suburb, or a searched bar; with no location it starts where the most bars are on. It follows the drink/Late/$10 filters and ❤️ Saved. 🔀 Shuffle picks among the nearest few. "Walk the route" is a Google Maps directions link (phones take 3 stops between start and finish, so a 5-bar route starts at the first bar).
- "📤 Share the app" (top banner and footer) uses the phone's share menu, or copies the link on a computer. "📲 Save as an app" opens step-by-step instructions for iPhone and Android (a `<dialog>`; Chrome's one-tap install shows as "Install now" when available). A tip under the list links to it on phones until installed or closed (localStorage `happy-hour-install-hidden`). Both buttons hide once it's installed.
- Filters never scroll sideways. On now / Today / All week is a full-width three-way switch (`.seg-full`); drink and other filters are a 4-column grid of emoji tiles (`.tiles`), with a "✕ Clear" tile when any are on; Plan ahead days are a 7-column row (`.days`). The results heading shows a big count ("134 on now", `setCount`).
