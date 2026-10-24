// Monthly check of every venue's source link in venues.js.
// Only clearly gone pages (404 or 410, or the website no longer exists) count as broken: many sites
// block automated visits (403, 429), and those pages are usually fine for people.
// With GITHUB_TOKEN set, the result goes into one open issue labelled "link check".
import { readFileSync } from "node:fs";
import vm from "node:vm";

const sandbox = { window: {} };
vm.runInNewContext(readFileSync(new URL("../../venues.js", import.meta.url), "utf8"), sandbox);
const venues = sandbox.window.VENUES;

const bySource = new Map();
for (const v of venues) {
  for (const [url, what] of [[v.source, ""], [v.specialsSource, " specials"]]) {
    if (!url) continue;
    if (!bySource.has(url)) bySource.set(url, []);
    bySource.get(url).push(`${v.name}${what} (${v.area}, ${v.city})`);
  }
}

async function check(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, {
        method, redirect: "follow", signal: AbortSignal.timeout(20000),
        headers: { "User-Agent": "Mozilla/5.0 (Happy Hour app monthly link check)" },
      });
      if (res.status === 404 || res.status === 410) {
        if (method === "HEAD") continue; // some sites only answer GET properly
        return `page not found (${res.status})`;
      }
      return null;
    } catch (e) {
      const code = e.cause && e.cause.code;
      if (code === "ENOTFOUND") return "website no longer exists";
      if (method === "GET") return null; // timeouts and other hiccups aren't treated as broken
    }
  }
  return null;
}

const broken = [];
const urls = [...bySource.keys()];
for (let i = 0; i < urls.length; i += 8) {
  const batch = urls.slice(i, i + 8);
  const results = await Promise.all(batch.map(check));
  results.forEach((problem, j) => { if (problem) broken.push({ url: batch[j], problem }); });
}

// Lots "broken" at once means the check itself couldn't get online, not that the pages are gone.
if (broken.length > urls.length / 4) {
  console.log(`${broken.length} of ${urls.length} links failed: looks like a network problem, so nothing is reported.`);
  process.exit(0);
}

const lines = broken.map((b) => `- [ ] ${bySource.get(b.url).join("; ")}: ${b.problem}\n  ${b.url}`);
console.log(`Checked ${urls.length} source links for ${venues.length} venues. Broken: ${broken.length}.`);
lines.forEach((l) => console.log(l));

const token = process.env.GITHUB_TOKEN, repo = process.env.GITHUB_REPOSITORY;
if (!token || !repo) process.exit(0);

const api = (path, options = {}) => fetch(`https://api.github.com/repos/${repo}${path}`, {
  ...options,
  headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
}).then((r) => r.json());

const open = await api("/issues?state=open&labels=link%20check");
const existing = Array.isArray(open) ? open[0] : null;
const today = new Date().toISOString().slice(0, 10);
if (!broken.length) {
  if (existing) {
    await api(`/issues/${existing.number}/comments`, { method: "POST", body: JSON.stringify({ body: `All source links worked on ${today}. Closing.` }) });
    await api(`/issues/${existing.number}`, { method: "PATCH", body: JSON.stringify({ state: "closed", state_reason: "completed" }) });
  }
  process.exit(0);
}
const body = `The monthly check on ${today} found ${broken.length} venue source link(s) that look gone. ` +
  `These deals may have ended: please re-check them, then update or remove the venue in venues.js.\n\n${lines.join("\n")}`;
const title = `Link check: ${broken.length} venue source link(s) look gone`;
if (existing) await api(`/issues/${existing.number}`, { method: "PATCH", body: JSON.stringify({ title, body }) });
else await api("/issues", { method: "POST", body: JSON.stringify({ title, body, labels: ["link check"] }) });
