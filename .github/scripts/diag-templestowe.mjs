// Temporary: use the live app like a person in Sydney searching Templestowe.
import { chromium } from "playwright";
const log = (...a) => console.log(...a);
const SITE = "https://sanj2888.github.io/Happy-Hour/";

// Wait for the new version to be published.
for (let i = 0; i < 30; i++) {
  const html = await (await fetch(SITE + "?v=" + Date.now())).text();
  if (html.includes("photon.komoot.io/reverse")) { log("New version is live"); break; }
  log("Waiting for publish..."); await new Promise((r) => setTimeout(r, 15000));
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, geolocation: { latitude: -33.8688, longitude: 151.2093 }, permissions: ["geolocation"] });
const page = await ctx.newPage();
page.on("pageerror", (e) => log("PAGEERROR", String(e)));
page.on("response", (r) => { const u = r.url(); if (/nominatim|photon|overpass|private\.coffee|kumi/.test(u)) log("RESP", r.status(), u.split("?")[0]); });
page.on("requestfailed", (r) => { const u = r.url(); if (/nominatim|photon|overpass|private\.coffee|kumi/.test(u)) log("FAILED", u.split("?")[0], r.failure() && r.failure().errorText); });
await page.goto(SITE + "?fresh=" + Date.now(), { waitUntil: "domcontentloaded" });
const snap = async (label) => log("STATE", label, "|", await page.textContent("#count"), "|", await page.textContent("#note"),
  "|", JSON.stringify(await page.$$eval("#list > li", (l) => l.slice(0, 10).map((x) => ((x.querySelector(".name") || x).textContent + " " + ((x.querySelector(".open-now") || {}).textContent || "")).trim().slice(0, 70)))));
await page.waitForTimeout(4000); await snap("Sydney, start");
await page.fill("#search", "Templestowe"); await page.keyboard.press("Enter");
await page.waitForTimeout(2000); await snap("Templestowe +2s");
await page.waitForTimeout(8000); await snap("Templestowe +10s");
await page.waitForTimeout(35000); await snap("Templestowe +45s");
await page.screenshot({ path: "templestowe.png" });
await page.click("[data-show=hh]"); await page.waitForTimeout(1000); await snap("Templestowe, Happy hours");
await browser.close();
