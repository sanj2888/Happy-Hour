// Temporary: reproduce "search Templestowe from Sydney" on the live site with real map services.
import { chromium } from "playwright";

const log = (...a) => console.log(...a);

// 1. The services directly
for (const url of [
  "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=au&q=templestowe",
  "https://photon.komoot.io/api/?limit=1&lang=en&bbox=112,-44,154,-10&q=templestowe",
]) {
  try { const r = await fetch(url, { headers: { "User-Agent": "HappyHour-diag", Referer: "https://sanj2888.github.io/" } }); log("GEO", r.status, (await r.text()).slice(0, 300)); }
  catch (e) { log("GEO ERR", url, String(e)); }
}
const lat = -37.7563, lon = 145.1515;
for (const server of ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter", "https://maps.mail.ru/osm/tools/overpass/api/interpreter"]) {
  for (const r of [2000, 5000]) {
    const q = `[out:json][timeout:25];nwr["amenity"~"^(bar|pub|nightclub|biergarten)$"](around:${r},${lat},${lon});out center tags 600;`;
    const t = Date.now();
    try {
      const res = await fetch(server, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "data=" + encodeURIComponent(q), signal: AbortSignal.timeout(30000) });
      const txt = await res.text();
      let n = "?"; let names = "";
      try { const j = JSON.parse(txt); n = j.elements.length; names = j.elements.map((e) => e.tags && e.tags.name).filter(Boolean).slice(0, 12).join(", "); } catch (e) { names = txt.slice(0, 150); }
      log("OVERPASS", server.split("/")[2], r, "status", res.status, "in", Date.now() - t, "ms ->", n, "|", names);
    } catch (e) { log("OVERPASS ERR", server.split("/")[2], r, String(e), "after", Date.now() - t, "ms"); }
  }
}

// 2. The live app, like a person in Sydney
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, geolocation: { latitude: -33.8688, longitude: 151.2093 }, permissions: ["geolocation"] });
const page = await ctx.newPage();
page.on("console", (m) => log("CONSOLE", m.type(), m.text().slice(0, 200)));
page.on("pageerror", (e) => log("PAGEERROR", String(e)));
page.on("requestfailed", (r) => log("REQFAIL", r.url().slice(0, 100), r.failure() && r.failure().errorText));
page.on("response", (r) => { const u = r.url(); if (/nominatim|photon|overpass|mail\.ru/.test(u)) log("RESP", r.status(), u.slice(0, 100)); });
await page.goto("https://sanj2888.github.io/Happy-Hour/?diag=" + Date.now(), { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
const state = async (label) => log("STATE", label, "| count:", (await page.textContent("#count")) || "", "| note:", await page.textContent("#note"),
  "| list:", JSON.stringify((await page.$$eval("#list > li", (l) => l.slice(0, 6).map((x) => x.innerText.replace(/\s+/g, " ").slice(0, 90))))));
await state("start");
await page.click("#search");
await page.type("#search", "Templestowe", { delay: 60 });
await page.waitForTimeout(800);
log("SUGGEST", JSON.stringify(await page.$$eval("#suggest li", (l) => l.map((x) => x.innerText.replace(/\s+/g, " ")))));
await page.keyboard.press("Enter");
for (const s of [3, 10, 25, 45]) { await page.waitForTimeout(s === 3 ? 3000 : (s - [3, 10, 25, 45][[3, 10, 25, 45].indexOf(s) - 1]) * 1000); await state(`+${s}s`); }
await page.screenshot({ path: "templestowe.png" });
await browser.close();
