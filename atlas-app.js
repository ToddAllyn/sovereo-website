var NEWS = "https://sovereo-web.pages.dev/api/news?country=";
var MID = " &middot; ";
function norm(s) { return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, ""); }
var DATA = window.SOVEREO_ATLAS || [];
var BYISO = {}, BYNAME = {};
DATA.forEach(function (c) { BYISO[c.iso] = c; BYNAME[norm(c.n)] = c; });
var ALIAS = { unitedstatesofamerica: "unitedstates", demrepcongo: "congodrc", congo: "congorepublic", dominicanrep: "dominicanrepublic", bosniaandherz: "bosniaandherzegovina", ssudan: "southsudan", centralafricanrep: "centralafricanrepublic", eqguinea: "equatorialguinea", solomonis: "solomonislands", laopdr: "laos", capeverde: "caboverde", swaziland: "eswatini", czechrep: "czechia", macedonia: "northmacedonia", republicofserbia: "serbia", unitedrepublicoftanzania: "tanzania", ivorycoast: "cotedivoire", easttimor: "timorleste", thebahamas: "bahamas" };
function lookup(f) {
  var p = f.properties || {};
  var iso = p.ISO_A3 || p.iso_a3 || p.ADM0_A3;
  if (iso && BYISO[iso]) return BYISO[iso];
  var k = norm(p.name || p.ADMIN || p.NAME);
  if (BYNAME[k]) return BYNAME[k];
  if (ALIAS[k] && BYNAME[ALIAS[k]]) return BYNAME[ALIAS[k]];
  return null;
}
function color(ov, a) {
  var t = Math.max(0, Math.min(1, (ov - 30) / (86 - 30)));
  var A = [38, 54, 79], B = [231, 184, 90];
  var r = Math.round(A[0] + (B[0] - A[0]) * t), g = Math.round(A[1] + (B[1] - A[1]) * t), b = Math.round(A[2] + (B[2] - A[2]) * t);
  return "rgba(" + r + "," + g + "," + b + "," + (a == null ? 0.82 : a) + ")";
}
var PILL = [["inc", "Income", "#E8A13C"], ["edu", "Education", "#5C9CE0"], ["hea", "Health", "#37B086"], ["env", "Environment", "#6FB1C7"], ["bel", "Belonging", "#C9739B"], ["leg", "Legacy", "#9784CE"], ["cap", "Capital", "#E2571E"]];
var PTAG = { Legacy: "#9784CE", Capital: "#E2571E", Income: "#E8A13C", Safety: "#E0715C", Health: "#37B086", Environment: "#6FB1C7", Belonging: "#C9739B", Education: "#5C9CE0", General: "#8B95A3" };
function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function bar(l, col, v) {
  var w = (v == null) ? 0 : v;
  return '<div class="prow"><div class="pnm">' + l + '</div><div class="ptrack"><div class="pfill" style="width:' + w + '%;background:' + col + '"></div></div><div class="pval">' + ((v == null) ? "n/a" : v) + '</div></div>';
}
function resetPanel() {
  document.getElementById("panel").innerHTML = '<div class="hint">Pick a country on the globe or search above.<br><br>You will see its <b>Sovereo scorecard</b> and a <b>live signals feed</b>, each story tagged to the index pillar it touches.</div>';
}
function select(c) {
  var p = document.getElementById("panel");
  var html = '<div class="ctry">' + esc(c.n) + '</div><div class="reg">' + esc(c.region) + '</div>';
  html += '<div class="ovrow"><div class="ov">' + c.ov + '</div><div class="ovlab">Sovereo<br>Index</div><div class="rank">Rank <b style="color:#E7B85A">' + c.rank + '</b><br>of 192</div></div>';
  html += '<div class="plab">The six forces, plus capital</div>';
  html += PILL.map(function (x) { return bar(x[1], x[2], c[x[0]]); }).join("");
  html += '<div class="sig" id="sig"><div class="plab">Live signals</div><div class="loading">Loading real headlines...</div></div>';
  html += '<a class="cta" href="Sovereo_Relocation_Diagnostic.html">See where you fit best, free &rarr;</a>';
  p.innerHTML = html;
  loadSignals(c);
}
function itemHTML(x) {
  var tg = x.pillar || "General";
  var col = PTAG[tg] || "#8B95A3";
  var meta = esc(x.source || "") + (x.time ? MID + esc(x.time) : "");
  return '<a class="item" href="' + esc(x.url) + '" target="_blank" rel="noopener"><span class="tag" style="background:' + col + '22;color:' + col + '">' + tg + '</span><div class="it">' + esc(x.title) + '</div><div class="imeta">' + meta + '</div></a>';
}
function loadSignals(c) {
  var el = document.getElementById("sig");
  var ctrl = new AbortController();
  var to = setTimeout(function () { ctrl.abort(); }, 18000);
  fetch(NEWS + encodeURIComponent(c.n), { signal: ctrl.signal }).then(function (r) { return r.ok ? r.json() : Promise.reject(); }).then(function (d) {
    clearTimeout(to);
    var a = (d && d.articles) || [];
    if (!a.length) { el.innerHTML = '<div class="plab">Live signals</div><div class="loading">No fresh Sovereo-relevant stories in the last few weeks.</div>'; return; }
    el.innerHTML = '<div class="plab">Live signals</div>' + a.slice(0, 8).map(itemHTML).join("");
  }).catch(function () {
    clearTimeout(to);
    el.innerHTML = '<div class="plab">Live signals</div><div class="loading">Live feed did not respond. Try again shortly.</div>';
  });
}
function centroid(f) {
  var g = f.geometry; if (!g) return [0, 0];
  var polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  var best = null, bn = -1;
  polys.forEach(function (poly) { var r = poly[0]; if (r && r.length > bn) { bn = r.length; best = r; } });
  if (!best) return [0, 0];
  var x = 0, y = 0; best.forEach(function (pt) { x += pt[0]; y += pt[1]; });
  return [x / best.length, y / best.length];
}
var world = null, selected = null, FEATS = [];
function capColor(f) {
  if (f === selected) { var c = lookup(f); return c ? color(c.ov, 1) : "rgba(231,184,90,0.9)"; }
  var c2 = lookup(f); return c2 ? color(c2.ov) : "rgba(120,130,145,0.22)";
}
function altFor(f) { return f === selected ? 0.09 : (f.__hover ? 0.05 : 0.012); }
function choose(f, fly) {
  var c = lookup(f); if (!c) return;
  selected = f;
  world.controls().autoRotate = false;
  world.polygonCapColor(capColor).polygonAltitude(altFor);
  if (fly) { var ce = centroid(f); world.pointOfView({ lat: ce[1], lng: ce[0], altitude: 1.6 }, 900); }
  select(c);
}
function labelFor(f) {
  var c = lookup(f);
  var nm = esc(f.properties.name || f.properties.ADMIN || "");
  if (c) return '<div style="font-family:Inter,Arial;font-size:12.5px;background:#0E1A2B;color:#FBF8F1;border:1px solid #C8A45C;border-radius:6px;padding:5px 9px"><b style="color:#E7B85A">' + nm + '</b>' + MID + c.ov + MID + '#' + c.rank + '</div>';
  return '<div style="font-family:Inter,Arial;font-size:12px;background:#0E1A2B;color:#8B95A3;border:1px solid rgba(255,255,255,.15);border-radius:6px;padding:5px 9px">' + nm + MID + 'no data</div>';
}
function featForCountry(c) {
  for (var i = 0; i < FEATS.length; i++) { if (lookup(FEATS[i]) === c) return FEATS[i]; }
  return null;
}
fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function (r) { return r.json(); }).then(function (topo) {
  var all = topojson.feature(topo, topo.objects.countries).features;
  FEATS = all.filter(function (f) { return (f.properties && f.properties.name) !== "Antarctica"; });
  world = Globe()(document.getElementById("glb"))
    .backgroundColor("#05080f")
    .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
    .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
    .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
    .showAtmosphere(true)
    .atmosphereColor("#5C9CE0")
    .atmosphereAltitude(0.16)
    .polygonsData(FEATS)
    .polygonAltitude(altFor)
    .polygonCapColor(capColor)
    .polygonSideColor(function () { return "rgba(0,0,0,0.12)"; })
    .polygonStrokeColor(function () { return "rgba(10,20,34,0.55)"; })
    .polygonLabel(labelFor)
    .onPolygonHover(function (h) {
      FEATS.forEach(function (d) { d.__hover = (d === h); });
      world.polygonAltitude(altFor);
    })
    .onPolygonClick(function (f) { choose(f, true); })
    .onGlobeClick(function () {
      selected = null;
      world.controls().autoRotate = true;
      world.polygonCapColor(capColor).polygonAltitude(altFor).pointOfView({ altitude: 2.3 }, 800);
      resetPanel();
    });
  var g = document.getElementById("glb");
  function size() { world.width(g.clientWidth).height(g.clientHeight); }
  size();
  window.addEventListener("resize", size);
  world.controls().autoRotate = true;
  world.controls().autoRotateSpeed = 0.5;
  world.pointOfView({ lat: 20, lng: 10, altitude: 2.3 }, 0);
  var ld = document.getElementById("loader"); if (ld) ld.style.display = "none";
}).catch(function (e) {
  var ld = document.getElementById("loader"); if (ld) ld.textContent = "Could not load the globe. " + String(e);
});
var q = document.getElementById("q"), res = document.getElementById("res");
var LIST = DATA.slice().sort(function (a, b) { return a.n.localeCompare(b.n); });
q.addEventListener("input", function () {
  var v = q.value.trim().toLowerCase();
  if (!v) { res.style.display = "none"; return; }
  var m = LIST.filter(function (c) { return c.n.toLowerCase().indexOf(v) > -1; }).slice(0, 8);
  res.innerHTML = m.map(function (c) { return '<div data-n="' + esc(c.n) + '">' + esc(c.n) + ' <span style="color:#8B95A3;font-size:12px">' + MID + c.ov + MID + '#' + c.rank + '</span></div>'; }).join("");
  res.style.display = m.length ? "block" : "none";
});
res.addEventListener("click", function (e) {
  var d = e.target.closest("[data-n]");
  if (!d) return;
  var c = BYNAME[norm(d.getAttribute("data-n"))];
  if (c) { res.style.display = "none"; q.value = c.n; var f = featForCountry(c); if (f && world) { choose(f, true); } else { select(c); } }
});
document.addEventListener("click", function (e) { if (!e.target.closest(".search")) res.style.display = "none"; });
