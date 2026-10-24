// Temporary: which free pub sources answer, and how fast.
const lat = -37.7541, lon = 145.1486;
const log = (...a) => console.log(...a);
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
async function tryIt(label, url, opts = {}) {
  const t = Date.now();
  try {
    const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(45000) });
    const txt = await res.text();
    let summary = txt.slice(0, 160).replace(/\s+/g, " ");
    try {
      const j = JSON.parse(txt);
      const items = j.elements || j.features || (Array.isArray(j) ? j : []);
      const names = items.map((e) => (e.tags && e.tags.name) || (e.properties && e.properties.name) || e.name || e.display_name).filter(Boolean);
      summary = `${items.length} results: ${names.slice(0, 10).join(", ")}`;
    } catch (e) {}
    log(label, "| status", res.status, "|", Date.now() - t, "ms |", summary);
  } catch (e) { log(label, "| ERROR", String(e).slice(0, 120), "|", Date.now() - t, "ms"); }
}
const q = (r, n) => `[out:json][timeout:25];nwr["amenity"~"^(bar|pub|nightclub|biergarten)$"](around:${r},${lat},${lon});out center tags ${n};`;
const servers = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter", "https://maps.mail.ru/osm/tools/overpass/api/interpreter", "https://overpass.private.coffee/api/interpreter", "https://overpass.osm.ch/api/interpreter"];
const browserHeaders = { "User-Agent": UA, Accept: "*/*", Referer: "https://sanj2888.github.io/", Origin: "https://sanj2888.github.io" };
for (const s of servers) {
  const host = s.split("/")[2];
  await tryIt(`POST form + browser headers ${host}`, s, { method: "POST", headers: { ...browserHeaders, "Content-Type": "application/x-www-form-urlencoded" }, body: "data=" + encodeURIComponent(q(5000, 600)) });
  await tryIt(`GET + browser headers ${host}`, s + "?data=" + encodeURIComponent(q(5000, 600)), { headers: browserHeaders });
}
// Sydney CBD, 2 km (busy area)
await tryIt("Sydney CBD 2km overpass-api.de GET", servers[0] + "?data=" + encodeURIComponent(`[out:json][timeout:25];nwr["amenity"~"^(bar|pub|nightclub|biergarten)$"](around:2000,-33.8688,151.2093);out center tags 600;`), { headers: browserHeaders });
await tryIt("Sydney CBD 2km private.coffee GET", servers[3] + "?data=" + encodeURIComponent(`[out:json][timeout:25];nwr["amenity"~"^(bar|pub|nightclub|biergarten)$"](around:2000,-33.8688,151.2093);out center tags 600;`), { headers: browserHeaders });
// Other free sources
await tryIt("Photon reverse pubs 5km", `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&radius=5&limit=50&osm_tag=amenity:pub&osm_tag=amenity:bar`, { headers: browserHeaders });
await tryIt("Photon search pub near", `https://photon.komoot.io/api/?q=pub&lat=${lat}&lon=${lon}&limit=50&osm_tag=amenity:pub`, { headers: browserHeaders });
await tryIt("Nominatim amenity=pub viewbox", `https://nominatim.openstreetmap.org/search?format=json&amenity=pub&viewbox=${lon - 0.06},${lat + 0.045},${lon + 0.06},${lat - 0.045}&bounded=1&limit=40`, { headers: browserHeaders });
