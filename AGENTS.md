# AGENTS.md

Guidance for AI coding agents working on this repo.

- The owner is not a developer. Explain things in plain English with click-by-click steps.
- Keep it free: no paid services, plans or API keys.
- One page, no build step: `index.html` (plain JavaScript, no frameworks) and `venues.js` (the venue list the owner edits in GitHub's editor). Don't add npm, a bundler or a framework without asking.
- Only add venues with a real source link and a `checked` date. Never make up deals, times or venues.
- Look: fun and bold for 18–35s (sunset gradient, Unbounded headings, emoji welcome). Colours are CSS variables in `:root`, redefined for dark mode. `thumbnail.png` is the link preview (1200×630).
- Cities for now: Sydney and Melbourne (`CITIES` in `index.html`).
- Before pushing, open the page in Chromium (Playwright) at phone width (390px), in light and dark mode, and check there are no console errors.
