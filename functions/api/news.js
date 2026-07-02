// GET /api/news?country=Portugal
// Live, English, country-anchored signals for the Sovereo Atlas.
// Pulls from GDELT (free, no key, ~15 min refresh), narrowed to Sovereo themes
// and English-language sources, then tags each story to the index pillar it touches.
// Runs server-side, so there is no CORS problem; results are edge-cached.

const THEME = '(visa OR residency OR "residence permit" OR citizenship OR passport OR tax OR "capital controls" OR inflation OR currency OR "cost of living" OR expat OR immigration OR retire OR pension OR "golden visa" OR "property rights" OR healthcare OR crime OR protest OR unrest OR election OR sanctions OR corruption OR "interest rate")';

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const country = (url.searchParams.get("country") || "").trim();
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=300, s-maxage=900"
  };
  if (!country) return new Response(JSON.stringify({ articles: [] }), { headers: cors });

  const q = '"' + country.replace(/"/g, "") + '" ' + THEME + ' sourcelang:eng';
  const api = "https://api.gdeltproject.org/api/v2/doc/doc?query=" + encodeURIComponent(q) +
    "&mode=artlist&format=json&maxrecords=60&timespan=21d&sort=datedesc";

  try {
    const r = await fetch(api, { headers: { "User-Agent": "SovereoAtlas/1.0" }, cf: { cacheTtl: 900, cacheEverything: true } });
    if (!r.ok) return new Response(JSON.stringify({ articles: [], error: "source " + r.status }), { headers: cors });
    const data = await r.json();
    const cn = country.toLowerCase();
    const adj = ADJ[country] ? ADJ[country].toLowerCase() : null;
    const seen = new Set();

    let arts = (data.articles || [])
      .filter(a => a && a.title && a.url)
      .filter(a => {
        const k = (a.title || "").slice(0, 60).toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .map(a => {
        const title = cleanTitle(a.title);
        const lt = title.toLowerCase();
        return {
          title: title,
          url: a.url,
          source: a.domain || "",
          time: rel(a.seendate),
          pillar: tag(title),
          _rel: (lt.indexOf(cn) > -1 || (adj && lt.indexOf(adj) > -1)) ? 1 : 0
        };
      });

    // Rank: country named in the headline first, then anything specific (non-General),
    // recency preserved within each group (source is already date-descending).
    arts.sort((a, b) => {
      if (a._rel !== b._rel) return b._rel - a._rel;
      const ag = a.pillar === "General" ? 1 : 0, bg = b.pillar === "General" ? 1 : 0;
      return ag - bg;
    });

    arts = arts.slice(0, 10).map(a => { delete a._rel; return a; });
    return new Response(JSON.stringify({ country, articles: arts }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ articles: [], error: "fetch failed" }), { headers: cors });
  }
}

// A few demonyms help anchor stories that name the people, not the country.
const ADJ = {
  "Portugal": "Portuguese", "Spain": "Spanish", "France": "French", "Germany": "German",
  "Italy": "Italian", "Greece": "Greek", "Netherlands": "Dutch", "Japan": "Japanese",
  "China": "Chinese", "Mexico": "Mexican", "Brazil": "Brazilian", "Argentina": "Argentine",
  "Thailand": "Thai", "Vietnam": "Vietnamese", "Malaysia": "Malaysian", "Turkey": "Turkish",
  "Poland": "Polish", "Sweden": "Swedish", "Norway": "Norwegian", "Ireland": "Irish",
  "Colombia": "Colombian", "Morocco": "Moroccan", "Egypt": "Egyptian", "India": "Indian"
};

function cleanTitle(t) {
  t = (t || "").replace(/\s+/g, " ").trim();
  return t.length > 140 ? t.slice(0, 137) + "..." : t;
}

function rel(seendate) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(seendate || "");
  if (!m) return "";
  const then = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  const mins = Math.max(1, Math.round((Date.now() - then) / 60000));
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
