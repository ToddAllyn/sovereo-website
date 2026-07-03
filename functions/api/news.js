// GET /api/news?country=Portugal
// Sovereo Atlas signals. Curated editorial feeds (the SITREP source spine) are pulled first,
// filtered to the selected country and tagged to the index pillar each story touches, with the
// GDELT Project as backfill so no country is ever empty. Runs server-side (no CORS). Only a
// successful, non-empty result is edge-cached (15 min); errors and empties are never cached,
// so a hiccup self-heals on the next request.

const CURATED = [
  // Latin America / Andes
  { n: "MercoPress", u: "https://en.mercopress.com/rss" },
  { n: "Colombia Reports", u: "https://colombiareports.com/feed/" },
  { n: "Brazilian Report", u: "https://brazilian.report/feed/" },
  { n: "InSight Crime", u: "https://insightcrime.org/feed/" },
  { n: "Americas Quarterly", u: "https://www.americasquarterly.org/feed/" },
  // MENA / Gulf
  { n: "Middle East Eye", u: "https://www.middleeasteye.net/rss" },
  { n: "The National", u: "https://www.thenationalnews.com/rss/" },
  { n: "Arab News", u: "https://www.arabnews.com/rss.xml" },
  { n: "Al-Monitor", u: "https://www.al-monitor.com/rss.xml" },
  // Africa
  { n: "Daily Maverick", u: "https://www.dailymaverick.co.za/rss/" },
  { n: "The Africa Report", u: "https://www.theafricareport.com/feed/" },
  { n: "Premium Times", u: "https://www.premiumtimesng.com/feed" },
  // Asia
  { n: "The Hindu", u: "https://www.thehindu.com/news/national/feeder/default.rss" },
  { n: "The Diplomat", u: "https://thediplomat.com/feed/" },
  { n: "Rappler", u: "https://www.rappler.com/feed/" },
  { n: "Nikkei Asia", u: "https://asia.nikkei.com/rss/feed/nar" },
  // Europe CEE / Eurasia
  { n: "Balkan Insight", u: "https://balkaninsight.com/feed/" },
  { n: "Eurasianet", u: "https://eurasianet.org/rss.xml" },
  { n: "bne IntelliNews", u: "https://www.intellinews.com/feed" },
  // Residency / tax + country risk
  { n: "IMI Daily", u: "https://www.imidaily.com/feed/" },
  { n: "Schengen News", u: "https://www.schengen.news/feed/" },
  { n: "Nomad Capitalist", u: "https://nomadcapitalist.com/feed/" },
  { n: "Crisis Group", u: "https://www.crisisgroup.org/rss.xml" },
  // Expanded country-naming desks
  { n: "Buenos Aires Herald", u: "https://buenosairesherald.com/feed" },
  { n: "Latin America Reports", u: "https://latinamericareports.com/feed/" },
  { n: "Duvar English", u: "https://www.duvarenglish.com/feed" },
  { n: "Amwaj Media", u: "https://amwaj.media/en/rss" },
  { n: "African Business", u: "https://african.business/feed" },
  { n: "Ecofin Agency", u: "https://www.ecofinagency.com/feed" },
  { n: "African Arguments", u: "https://africanarguments.org/feed/" },
  { n: "LiveMint", u: "https://www.livemint.com/rss/news" },
  { n: "The Wire India", u: "https://thewire.in/rss" },
  { n: "Korea Herald", u: "https://www.koreaherald.com/rss/newsAll.xml" },
  { n: "OC Media", u: "https://oc-media.org/feed/" },
  { n: "EurActiv", u: "https://www.euractiv.com/feed/?post_type=news" },
  { n: "Al Jazeera", u: "https://www.aljazeera.com/xml/rss/all.xml" },
  { n: "OCCRP", u: "https://www.occrp.org/en/feed" }
];

const THEME = '(visa OR residency OR "residence permit" OR citizenship OR passport OR tax OR "capital controls" OR inflation OR currency OR "cost of living" OR expat OR immigration OR retire OR pension OR "golden visa" OR "property rights" OR healthcare OR crime OR protest OR unrest OR election OR sanctions OR corruption OR "interest rate")';

const UA = "Mozilla/5.0 (compatible; SovereoAtlas/1.0; +https://www.sovereo.com)";

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const country = (url.searchParams.get("country") || "").trim();
  const ok = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json", "Cache-Control": "public, max-age=300, s-maxage=900" };
  const no = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (!country) return new Response(JSON.stringify({ articles: [] }), { headers: no });

  const cn = country.toLowerCase();
  const terms = [cn];
  if (ADJ[country]) terms.push(ADJ[country].toLowerCase());
  if (ALT[country]) ALT[country].forEach(function (x) { terms.push(x.toLowerCase()); });

  const seen = new Set();
  let curated = [];

  // Feeds dedicated to a single country are treated as authoritative for it.
  const HOME = { "Colombia Reports": "colombia", "Brazilian Report": "brazil", "Buenos Aires Herald": "argentina", "Premium Times": "nigeria", "Daily Maverick": "south africa", "The Hindu": "india", "LiveMint": "india", "The Wire India": "india", "Korea Herald": "south korea", "Duvar English": "turkey", "Rappler": "philippines" };

  // 1) Curated editorial feeds, in parallel. Each feed fetch is edge-cached, so repeats are cheap.
  try {
    const settled = await Promise.allSettled(CURATED.map(function (f) { return fetchFeed(f); }));
    let items = [];
    settled.forEach(function (s) { if (s.status === "fulfilled" && s.value) items = items.concat(s.value); });
    const FRESH = 60 * 24 * 60 * 60 * 1000; // ignore anything older than ~60 days
    for (const it of items) {
      const home = HOME[it.source] === cn;
      const inTitle = mentions(it.title.toLowerCase(), terms);
      // Require the country in the headline, or a source dedicated to that country.
      // Body-only mentions are dropped, since they cause cross-country leaks (a Mexico story that name-checks Brazil).
      if (!home && !inTitle) continue;
      if (it.ts && (Date.now() - it.ts) > FRESH) continue;
      const key = it.title.slice(0, 60).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      curated.push({ title: clean(it.title), url: it.url, source: it.source, time: rel(it.ts), pillar: tag(it.title + " " + (it.desc || "")), _ts: it.ts || 0, _score: home ? 3 : 2 });
    }
    curated.sort(function (a, b) { if (b._score !== a._score) return b._score - a._score; return (b._ts || 0) - (a._ts || 0); });
  } catch (e) { curated = []; }

  let out = curated.slice(0, 10);

  // 2) GDELT backfill only if curated coverage is thin.
  if (out.length < 8) {
    const g = await gdelt(country);
    for (const a of g) {
      const key = a.title.slice(0, 60).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(a);
      if (out.length >= 10) break;
    }
  }

  out = out.map(function (a) { return { title: a.title, url: a.url, source: a.source, time: a.time, pillar: a.pillar }; });
  return new Response(JSON.stringify({ country, articles: out }), { headers: out.length ? ok : no });
}

async function fetchFeed(f) {
  try {
    const ctrl = new AbortController();
    const to = setTimeout(function () { ctrl.abort(); }, 5500);
    const r = await fetch(f.u, {
      signal: ctrl.signal,
      headers: { "User-Agent": UA, "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
      cf: { cacheTtl: 900, cacheEverything: true }
    });
    clearTimeout(to);
    if (!r.ok) return [];
    const t = await r.text();
    return parseFeed(t, f.n);
  } catch (e) { return []; }
}

function parseFeed(xml, source) {
  const out = [];
  let blocks = xml.match(/<item[\s\S]*?<\/item>/gi);
  if (!blocks) blocks = xml.match(/<entry[\s\S]*?<\/entry>/gi);
  if (!blocks) return out;
  for (let i = 0; i < blocks.length && i < 25; i++) {
    const b = blocks[i];
    let title = pick(b, /<title[^>]*>([\s\S]*?)<\/title>/i);
    let link = pick(b, /<link[^>]*>([\s\S]*?)<\/link>/i);
    if (!link) {
      let m = b.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i) || b.match(/<link[^>]*href="([^"]+)"/i);
      if (m) link = m[1];
    }
    let desc = pick(b, /<description[^>]*>([\s\S]*?)<\/description>/i) || pick(b, /<summary[^>]*>([\s\S]*?)<\/summary>/i) || pick(b, /<content[^>]*>([\s\S]*?)<\/content>/i);
    let dstr = pick(b, /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || pick(b, /<updated[^>]*>([\s\S]*?)<\/updated>/i) || pick(b, /<published[^>]*>([\s\S]*?)<\/published>/i) || pick(b, /<dc:date[^>]*>([\s\S]*?)<\/dc:date>/i);
    title = decode(stripTags(title));
    link = decode(stripTags(link)).trim();
    if (!title || !link) continue;
    let ts = dstr ? Date.parse(stripTags(dstr).trim()) : 0;
    if (isNaN(ts)) ts = 0;
    out.push({ title: title, url: link, desc: decode(stripTags(desc)).slice(0, 300), ts: ts, source: source });
  }
  return out;
}

function pick(s, re) { const m = s.match(re); return m ? m[1] : ""; }
function stripTags(s) { return (s || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
function decode(s) {
  return (s || "")
    .replace(/&#x([0-9a-fA-F]+);/g, function (_, h) { try { return String.fromCharCode(parseInt(h, 16)); } catch (e) { return ""; } })
    .replace(/&#(\d+);/g, function (_, d) { try { return String.fromCharCode(parseInt(d, 10)); } catch (e) { return ""; } })
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function clean(t) { t = (t || "").replace(/\s+/g, " ").trim(); return t.length > 140 ? t.slice(0, 137) + "..." : t; }

function mentions(hay, terms) {
  for (const t of terms) {
    if (!t) continue;
    if (t.length < 5) {
      if (new RegExp("\\b" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b").test(hay)) return true;
    } else if (hay.indexOf(t) > -1) return true;
  }
  return false;
}

async function gdelt(country) {
  const q = '"' + country.replace(/"/g, "") + '" ' + THEME + ' sourcelang:english';
  const api = "https://api.gdeltproject.org/api/v2/doc/doc?query=" + encodeURIComponent(q) + "&mode=artlist&format=json&maxrecords=30&timespan=21d&sort=datedesc";
  try {
    const ctrl = new AbortController();
    const to = setTimeout(function () { ctrl.abort(); }, 6000);
    const r = await fetch(api, { signal: ctrl.signal, headers: { "User-Agent": "SovereoAtlas/1.0" }, cf: { cacheTtl: 900, cacheEverything: true } });
    clearTimeout(to);
    if (!r.ok) return [];
    const d = await r.json();
    const cn = country.toLowerCase();
    return (d.articles || []).filter(function (a) { return a && a.title && a.url; }).map(function (a) {
      const title = clean(a.title);
      return { title: title, url: a.url, source: a.domain || "", time: rel(gts(a.seendate)), pillar: tag(title), _rel: title.toLowerCase().indexOf(cn) > -1 ? 1 : 0 };
    }).sort(function (a, b) { return b._rel - a._rel; });
  } catch (e) { return []; }
}

function gts(seendate) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(seendate || "");
  if (!m) return 0;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
}
function rel(ts) {
  if (!ts) return "";
  const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (mins < 60) return mins + "m ago";
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  return Math.round(hrs / 24) + "d ago";
}

function tag(text) {
  const t = (text || "").toLowerCase();
  if (/\bvisa|residenc|citizenship|passport|golden visa|immigration|permit|naturaliz|deport|border/.test(t)) return "Legacy";
  if (/\btax|capital control|repatriat|invest|business|property right|expropriat|central bank|interest rate|bond|debt|sanction|trade/.test(t)) return "Capital";
  if (/inflation|currency|peso|lira|devalu|cost of living|\bprice|economy|gdp|recession|wage|unemployment|pension|salary/.test(t)) return "Income";
  if (/school|universit|student|education|literacy|tuition|scholarship/.test(t)) return "Education";
  if (/crime|violence|kidnap|cartel|security|unrest|protest|coup|attack|\bwar\b|terror|shooting|murder|riot/.test(t)) return "Safety";
  if (/health|hospital|medical|doctor|disease|clinic|vaccine|outbreak|care system/.test(t)) return "Health";
  if (/climate|flood|wildfire|drought|pollution|earthquake|hurricane|air quality|heatwave|emission|environment/.test(t)) return "Environment";
  if (/discrimin|migrant|refugee|racism|lgbt|welcome|minorit|integration|xenophob|asylum/.test(t)) return "Belonging";
  if (/election|parliament|president|government|coalition|referendum|\blaw\b|policy|reform|minister/.test(t)) return "Legacy";
  return "General";
}

const ADJ = {
  "Portugal": "Portuguese", "Spain": "Spanish", "France": "French", "Germany": "German",
  "Italy": "Italian", "Greece": "Greek", "Netherlands": "Dutch", "Japan": "Japanese",
  "China": "Chinese", "Mexico": "Mexican", "Brazil": "Brazilian", "Argentina": "Argentine",
  "Thailand": "Thai", "Vietnam": "Vietnamese", "Malaysia": "Malaysian", "Turkey": "Turkish",
  "Poland": "Polish", "Sweden": "Swedish", "Norway": "Norwegian", "Ireland": "Irish",
  "Colombia": "Colombian", "Morocco": "Moroccan", "Egypt": "Egyptian", "India": "Indian"
};

const ALT = {
  "United States": ["u.s.", "usa", "american"],
  "United Kingdom": ["u.k.", "britain", "british"],
  "United Arab Emirates": ["uae", "emirati", "dubai", "abu dhabi"],
  "South Korea": ["korea", "korean"],
  "Czechia": ["czech"]
};
