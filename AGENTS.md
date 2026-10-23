# AGENTS.md

Guidance for AI coding agents working on this repo.

- The owner is not a developer. Explain things in plain English with click-by-click steps.
- Keep it free: no paid services, plans or API keys.
- One page, no build step: `index.html` (plain JavaScript, no frameworks) and `venues.js` (the venue list the owner edits in GitHub's editor). Don't add npm, a bundler or a framework without asking.
- Only add venues with a real source link, known days and times, and a `checked` date. Never make up deals, times or venues; skip a venue if a detail is missing. Members-only club deals are included with `members: true`, which shows a "Members only" label.
- `lat`/`lon` are approximate (from the street address or suburb), so the app rounds distances ("about 2 km away"). Directions search Google Maps by name and suburb.
- Look: fun and bold for 18–35s, a neon night-out theme (always dark, pink and cyan glows, Unbounded headings, emoji welcome). Colours are CSS variables in `:root`. `thumbnail.png` is the link preview (1200×630).
- Cities for now: Sydney and Melbourne (`CITIES` in `index.html`).
- Before pushing, open the page in Chromium (Playwright) at phone width (390px), in light and dark mode, and check there are no console errors.
- New suburbs need a region in `REGIONS` in `index.html` (for the Plan ahead area picker); unmapped suburbs fall under "Other areas".
- Saved spots live only on each phone (localStorage `happy-hour-saved`). `sw.js` caches the app network-first so it opens with poor signal.
