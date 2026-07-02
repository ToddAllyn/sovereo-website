// GET /api/news?country=Portugal
// Live, filtered, per-country signals for the Sovereo Atlas.
// Pulls from GDELT (free, no key, refreshed ~every 15 min), narrowed to the
// themes Sovereo cares about, and tags each story to the index pillar it touches.
// Runs server-side, so there is no CORS problem; results are edge-cached.

const THEME = '(visa OR residency OR "residence permit" OR citizenship OR tax OR "capital controls" OR inflation OR currency OR "cost of living" OR expat OR immigration OR retire OR "golden visa" OR "property rights" OR safety OR unrest)';

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

  const q = '"' + country.replace(/"/g, "") + '" ' + THEME;
  const api = "https://api.gdeltproject.org/api/v2/doc/doc?query=" + encodeURIComponent(q) +
    "&mode=artlist&format=json&maxrecords=18&timespan=21d&sort=datedesc";

  try {
    const r = await fetch(api, { headers: { "User-Agent": "SovereoAtlas/1.0" }, cf: { cacheTtl: 900, cacheEverything: true } });
    if (!r.ok) return new Response(JSON.stringify({ articles: [], error: "source " + r.status }), { headers: cors });
    const data = await r.json();
    const seen = new Set();
    const articles = (data.articles || [])
      .filter(a => a && a.title && a.url)
      .filter(a => { const k = (a.title || "").slice(0, 60).toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
      .slice(0, 10)
      .map(a => ({
        title: cleanTitle(a.title),
        url: a.url,
        source: a.domain || "",
        time: rel(a.seendate),
        pillar: tag(a.title)
      }));
    return new Response(JSON.stringify({ country, articles }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ articles: [], error: "fetch failed" }), { headers: cors });
  }
}

function cleanTitle(t) {
  t = (t || "").replace(/\s+/g, " ").trim();
  return t.length > 140 ? t.slice(0, 137) + "..." : t;
}

function rel(seendate) {
  // GDELT format: 20260701T120000Z
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
  if (/visa|residenc|citizenship|passport|golden|immigration|permit/.test(t)) return "Legacy";
  if (/tax|capital control|repatriat|invest|business|property right|expropriat|central bank/.test(t)) return "Capital";
  if (/inflation|currency|peso|lira|devalu|cost of living|price|economy|gdp|recession/.test(t)) return "Income";
  if (/crime|violence|kidnap|cartel|security|unrest|protest|coup|attack/.test(t)) return "Safety";
  if (/health|hospital|medical|doctor|disease/.test(t)) return "Health";
  if (/climate|flood|wildfire|drought|pollution|earthquake|hurricane|air quality/.test(t)) return "Environment";
  if (/discrimin|migrant|refugee|racism|lgbt|welcome/.test(t)) return "Belonging";
  return "General";
}
