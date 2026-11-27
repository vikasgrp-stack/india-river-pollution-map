/* India River Pollution Map — standalone Leaflet build.
   Data: local GeoJSON/CSV under data/. Basemaps: OSM streets + Esri World
   Imagery satellite (free, attribution only) with Esri reference overlays. */
'use strict';

/* ============================== config ============================== */
const RIVERS = {
  ganga: {
    label: 'Ganga',
    dir: 'data/ganga',
    files: { drains: 'drains.geojson', stps: 'stp_accountability.geojson', wq: 'water_quality.geojson',
             people: 'people.geojson', courses: 'drain_courses.geojson', industries: 'industries.geojson',
             river: 'ganga_river.geojson', corridor: 'ganga_corridor_buffer.geojson', population: 'population.json' },
    center: [26.0, 82.6], zoom: 6,
    maxDrainLoad: 260.67, maxStpCap: 320,
    stateAgency: { 'Uttarakhand': 'Uttarakhand Peyjal Nigam', 'Uttar Pradesh': 'UP Jal Nigam',
                   'Bihar': 'BUIDCO', 'Jharkhand': 'JUIDCO', 'West Bengal': 'KMDA' },
  },
  yamuna: {
    label: 'Yamuna',
    dir: 'data/yamuna',
    files: { drains: 'drains.geojson', stps: 'stps.geojson', wq: 'water_quality.geojson',
             people: 'people.geojson', courses: 'drain_courses.geojson', industries: 'industries.geojson',
             river: 'yamuna_river.geojson', corridor: 'yamuna_corridor_buffer.geojson', population: 'population.json' },
    center: [27.7, 78.4], zoom: 6,
    maxDrainLoad: 111.77, maxStpCap: 320,
    stateAgency: { 'Delhi': 'Delhi Jal Board', 'Haryana': 'Haryana State Pollution Control Board + municipal body',
                   'Uttar Pradesh': 'UP Jal Nigam', 'Himachal Pradesh': 'HP State Pollution Control Board', 'Uttarakhand': 'Uttarakhand Peyjal Nigam' },
  },
  sabarmati: {
    label: 'Sabarmati',
    dir: 'data/sabarmati',
    files: { drains: 'drains.geojson', stps: 'stps.geojson', wq: 'water_quality.geojson',
             people: 'people.geojson', courses: 'drain_courses.geojson', industries: 'industries.geojson',
             river: 'sabarmati_river.geojson', corridor: 'sabarmati_corridor_buffer.geojson', population: 'population.json' },
    center: [23.4, 72.85], zoom: 7,
    maxDrainLoad: 45.5, maxStpCap: 240,
    stateAgency: {},
  },
  cauvery: {
    label: 'Cauvery',
    dir: 'data/cauvery',
    files: { drains: 'drains.geojson', stps: 'stps.geojson', wq: 'water_quality.geojson',
             people: 'people.geojson', courses: 'drain_courses.geojson', industries: 'industries.geojson',
             river: 'cauvery_river.geojson', corridor: 'cauvery_corridor_buffer.geojson', population: 'population.json' },
    center: [12.0, 77.8], zoom: 7,
    maxDrainLoad: 53.75, maxStpCap: 150,
    stateAgency: {},
  },
};
const ANCHOR_TOWNS = ['Haridwar', 'Kanpur', 'Prayagraj', 'Varanasi', 'Patna', 'Bhagalpur', 'Kolkata'];
const PARTY_COLORS = { 'BJP': '#f97316', 'SP': '#dc2626', 'INC': '#38bdf8', 'AITC': '#16a34a',
  'BSP': '#2563eb', 'JD(U)': '#9333ea', 'BJP-led NDA': '#f97316', 'NDA': '#f97316', 'JMM-led': '#65a30d' };
const STATE_AGENCY_DEFAULT = 'state executing agency + State Pollution Control Board';

const state = {
  riverFilter: 'all',   // 'all' | 'ganga' | 'yamuna' | 'sabarmati' | 'cauvery' — the map shows ALL rivers at once by default
  basemap: 'streets',
  activeLayer: 'all',       // 'all' or one of: drains, stps, wq, towns, courses, industries, corridor
  shortcomingsOnly: false,
  data: {},                 // per-river cache: { drains, stps, wq, people, courses, industries, river, corridor, population }
  layers: {},               // leaflet layer objects for the current scope
  townIndex: {},            // "Town · River" -> { river, props }
  stpBudgetById: {},        // yamuna + sabarmati + cauvery budgets
  religionRuling: null,
  standards: null,
  stdParam: 'BOD',
  userLoc: null,            // { lat, lng } once the user taps "Near me"
};
function activeRivers() { return state.riverFilter === 'all' ? Object.keys(RIVERS) : [state.riverFilter]; }
function riverLabel(river) { return RIVERS[river].label; }

/* ============================== helpers ============================== */
const $ = (s) => document.querySelector(s);
const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (v, d = 1) => (v == null || v === '' || isNaN(+v)) ? '—' : (+v).toLocaleString('en-IN', { maximumFractionDigits: d, minimumFractionDigits: 0 });
const num0 = (v) => num(v, 0);
const pct = (v) => (v == null || isNaN(+v)) ? '—' : Math.round(+v) + '%';
function fmtCrore(v) { return (v == null || v === '' || isNaN(+v)) ? null : '₹' + (+v).toLocaleString('en-IN', { maximumFractionDigits: 2 }) + ' crore'; }
function partyColor(p) {
  if (!p) return '#6b7280';
  for (const k of Object.keys(PARTY_COLORS)) if (String(p).includes(k)) return PARTY_COLORS[k];
  return '#6b7280';
}
/* Minimal robust CSV parser (handles quoted fields, embedded commas/newlines). */
function parseCSV(text) {
  const rows = []; let row = [], cur = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else inQ = false; }
      else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur); cur = ''; rows.push(row); row = [];
    } else cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift().map((h) => h.trim());
  return rows.filter((r) => r.some((c) => String(c).trim() !== '')).map((r) => {
    const o = {}; head.forEach((h, i) => { o[h] = r[i] == null ? '' : r[i]; }); return o;
  });
}
async function fetchJSON(p) { const r = await fetch(p); if (!r.ok) throw new Error('Failed to load ' + p); return r.json(); }
async function fetchText(p) { const r = await fetch(p); if (!r.ok) throw new Error('Failed to load ' + p); return r.text(); }

/* ---------- shared chart tooltip: one component, every chart ----------
   Any element with a data-tip attribute shows the tooltip on hover (and on
   tap/click, which pins it for touch). Charts also get a visible hover state
   via CSS. Elements that represent a real item get a data-open attribute
   ("kind|river|key") — clicking opens that item's detail card. */
const chartTip = document.getElementById('chartTip');
let tipPinned = null;
function showTip(text, x, y) {
  chartTip.textContent = text;
  chartTip.hidden = false;
  const pad = 12, w = chartTip.offsetWidth, h = chartTip.offsetHeight;
  chartTip.style.left = Math.min(window.innerWidth - w - pad, Math.max(pad, x + 14)) + 'px';
  chartTip.style.top = Math.max(pad, Math.min(window.innerHeight - h - pad, y + 14)) + 'px';
}
function hideTip() { chartTip.hidden = true; tipPinned = null; }
document.addEventListener('mouseover', (e) => {
  if (tipPinned) return;
  const t = e.target.closest ? e.target.closest('[data-tip]') : null;
  if (t) showTip(t.getAttribute('data-tip'), e.clientX, e.clientY);
});
document.addEventListener('mousemove', (e) => {
  if (tipPinned || chartTip.hidden) return;
  const t = e.target.closest ? e.target.closest('[data-tip]') : null;
  if (t) showTip(t.getAttribute('data-tip'), e.clientX, e.clientY);
  else hideTip();
});
document.addEventListener('mouseout', (e) => {
  if (tipPinned) return;
  const t = e.target.closest ? e.target.closest('[data-tip]') : null;
  if (t && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-tip]') === t)) hideTip();
});
document.addEventListener('click', (e) => {
  const t = e.target.closest ? e.target.closest('[data-tip]') : null;
  if (t && e.target.closest('[data-open]') == null) {
    // tap pins the tooltip (touch); a second tap dismisses it
    if (tipPinned === t) { hideTip(); return; }
    tipPinned = t;
    showTip(t.getAttribute('data-tip'), e.clientX, e.clientY);
    return;
  }
  if (!t) hideTip();
});
document.addEventListener('click', (e) => {
  const opener = e.target.closest ? e.target.closest('[data-open]') : null;
  if (!opener) return;
  const parts = opener.getAttribute('data-open').split('|');
  const kind = parts[0], river = parts[1], key = parts.slice(2).join('|');
  openItemCard(kind, river, key);
});

/* ---------- tiny SVG chart helpers ---------- */
function hbarRow(label, value, max, color, valText, tipText) {
  const w = max > 0 ? Math.max(2, Math.min(100, (value / max) * 100)) : 0;
  const tip = tipText ? ' data-tip="' + esc(tipText) + '"' : '';
  return '<div class="hbar-row"><span>' + esc(label) + '</span>' +
    '<div class="hbar-track"><div class="hbar-fill" style="width:' + w + '%;background:' + color + '"' + tip + '></div></div>' +
    '<span style="text-align:right;font-weight:700">' + esc(valText) + '</span></div>';
}
function donutSVG(parts, size, holeLabel) {
  // parts: [{label, value, color}]
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const R = 42, C = 2 * Math.PI * R; let off = 0, segs = '';
  for (const p of parts) {
    const frac = p.value / total;
    const tip = p.label + ' — ' + pct(p.value) + ' of workers';
    segs += '<circle cx="50" cy="50" r="' + R + '" fill="none" stroke="' + p.color + '" stroke-width="15" ' +
      'stroke-dasharray="' + (frac * C).toFixed(1) + ' ' + (C - frac * C).toFixed(1) + '" stroke-dashoffset="' + (-off * C).toFixed(1) + '" transform="rotate(-90 50 50)" data-tip="' + esc(tip) + '"/>';
    off += frac;
  }
  return '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">' +
    '<svg width="' + size + '" height="' + size + '" viewBox="0 0 100 100">' + segs +
    '<text x="50" y="47" text-anchor="middle" font-size="15" font-weight="700" fill="#1a2b3c">' + esc(holeLabel) + '</text>' +
    '<text x="50" y="62" text-anchor="middle" font-size="8.5" fill="#6b7d90">of workers</text></svg>' +
    '<div class="donut-legend" style="font-size:13.5px">' + parts.map((p) => '<div style="margin:2px 0;padding:1px 4px" data-tip="' + esc(p.label + ' — ' + pct(p.value) + ' of workers') + '"><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:' + p.color + ';margin-right:6px"></span>' + esc(p.label) + ' — <b>' + pct(p.value) + '</b></div>').join('') + '</div></div>';
}
function sparkline(values, color, years) {
  const w = 260, h = 54, pad = 4;
  const pts = values.filter((v) => v != null && !isNaN(v));
  if (pts.length < 2) return '<p class="chart-sub">Not enough yearly readings to draw a trend.</p>';
  const min = Math.min.apply(null, pts), max = Math.max.apply(null, pts);
  const span = (max - min) || 1;
  const xy = values.map((v, i) => [pad + (i * (w - 2 * pad)) / (values.length - 1), (v == null || isNaN(v)) ? null : h - pad - ((v - min) / span) * (h - 2 * pad)]);
  const linePts = xy.filter((p) => p[1] != null);
  const line = linePts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const dots = xy.map((p, i) => {
    if (p[1] == null) return '';
    const yr = years ? years[i] : (2014 + i);
    return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.5" fill="' + color + '" data-tip="' + yr + ': BOD ' + num(values[i]) + ' mg/l (bathing standard 3 mg/l)"/>';
  }).join('');
  return '<svg width="100%" viewBox="0 0 ' + w + ' ' + h + '" style="max-width:280px"><path d="' + line + '" fill="none" stroke="' + color + '" stroke-width="2.5"/>' + dots + '</svg>';
}
function animateCountUps(root) {
  root.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const t0 = performance.now(), dur = 900;
    function step(t) {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (target * e).toLocaleString('en-IN', { maximumFractionDigits: dec, minimumFractionDigits: dec }) + suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ============================== map + basemaps ============================== */
const map = L.map('map', { zoomControl: false, attributionControl: true }).setView(RIVERS.ganga.center, RIVERS.ganga.zoom);
// zoom buttons bottom-right — top-left sits under the control panel
L.control.zoom({ position: 'bottomright' }).addTo(map);
const OSM_ATTR = '© OpenStreetMap contributors';
const ESRI_ATTR = 'Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community';
const ESRI_REF_ATTR = 'Esri, HERE, Garmin, © OpenStreetMap contributors';

const streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: OSM_ATTR });
const satImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19, attribution: ESRI_ATTR });
const satTransport = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19, attribution: ESRI_REF_ATTR });
const satPlaces = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19, attribution: ESRI_REF_ATTR });
const satelliteLayer = L.layerGroup([satImagery, satTransport, satPlaces]);
streetLayer.addTo(map);

function setBasemap(which) {
  state.basemap = which;
  if (which === 'satellite') {
    if (map.hasLayer(streetLayer)) map.removeLayer(streetLayer);
    if (!map.hasLayer(satelliteLayer)) satelliteLayer.addTo(map);
    $('#basemapAttr').textContent = ESRI_ATTR + ' · ' + ESRI_REF_ATTR;
  } else {
    if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
    if (!map.hasLayer(streetLayer)) streetLayer.addTo(map);
    $('#basemapAttr').textContent = OSM_ATTR;
  }
  $('#bmStreets').classList.toggle('active', which === 'streets');
  $('#bmSatellite').classList.toggle('active', which === 'satellite');
}
$('#bmStreets').addEventListener('click', () => setBasemap('streets'));
$('#bmSatellite').addEventListener('click', () => setBasemap('satellite'));

/* ============================== marker builders ============================== */
/* Encoding (strict): shape = type, size = magnitude, colour = status.
   Drains are NEVER green (except tapped/intercepted ones). Grey = never
   measured / not assessed. Faded = estimated load. */
function drainColor(p) {
  if (p.tapped === true || p.tapped_status === 'Tapped') return '#16a34a'; // tapped only
  const load = +p.bod_load_tpd;
  if (p.data_status === 'unmeasured' || load == null || isNaN(load)) return '#9ca3af';
  if (load < 1) return '#f59e0b';
  if (load < 10) return '#ea580c';
  if (load < 50) return '#dc2626';
  return '#7f1d1d';
}
function drainSize(p, maxLoad) {
  const load = +p.bod_load_tpd;
  if (load == null || isNaN(load) || load <= 0) return 13;
  return Math.round(13 + 26 * Math.sqrt(load / maxLoad));
}
function dropletIcon(p, maxLoad) {
  const color = drainColor(p);
  const s = drainSize(p, maxLoad);
  const faded = p.data_status === 'estimated';
  const svg = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24">' +
    '<path d="M12 2.2C12 2.2 5.4 10.1 5.4 14.7a6.6 6.6 0 0 0 13.2 0C18.6 10.1 12 2.2 12 2.2Z" fill="' + color + '" ' +
    'fill-opacity="' + (faded ? 0.55 : 0.95) + '" stroke="#fff" stroke-width="1.4" ' + (faded ? 'stroke-dasharray="2.5 1.8"' : '') + '/>' +
    '<circle cx="12" cy="15" r="2.1" fill="#fff" opacity="0.85"/></svg>';
  return L.divIcon({ html: svg, className: 'mk-icon', iconSize: [s, s], iconAnchor: [s / 2, s / 2] });
}
function stpColor(p) {
  if (p.ngt_compliant === true) return '#16a34a';
  if (p.ngt_compliant === false) return '#dc2626';
  return '#9ca3af';
}
function stpSize(p, maxCap) {
  const cap = +p.capacity_mld;
  if (cap == null || isNaN(cap) || cap <= 0) return 16;
  return Math.round(15 + 25 * Math.sqrt(cap / maxCap));
}
function stpIcon(p, maxCap) {
  const color = stpColor(p);
  const s = stpSize(p, maxCap);
  // a clarifier basin seen from above — a round tank with a scraper arm,
  // which is what a treatment plant actually looks like (and what it looks
  // like on the satellite view). Not a factory: a plant cleans water, it
  // does not manufacture anything.
  const svg = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24">' +
    '<circle cx="12" cy="12" r="9.4" fill="' + color + '" fill-opacity="0.95" stroke="#fff" stroke-width="1.4"/>' +
    '<circle cx="12" cy="12" r="6.1" fill="#fff" fill-opacity="0.30"/>' +
    '<line x1="12" y1="12" x2="12" y2="3.4" stroke="#fff" stroke-width="1.7"/>' +
    '<circle cx="12" cy="12" r="1.7" fill="#fff"/></svg>';
  return L.divIcon({ html: svg, className: 'mk-icon', iconSize: [s, s], iconAnchor: [s / 2, s / 2] });
}
function wqIcon(p) {
  const bod = +p.bod_latest;
  const color = (bod == null || isNaN(bod)) ? '#9ca3af' : (bod <= 3 ? '#16a34a' : '#dc2626');
  const s = 17;
  return L.divIcon({ html: '<div style="width:' + s + 'px;height:' + s + 'px;border-radius:50%;background:' + color + ';border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>',
    className: 'mk-icon', iconSize: [s, s], iconAnchor: [s / 2, s / 2] });
}
function townIcon(p) {
  const pop = +p.population_2011;
  const r = (pop && !isNaN(pop)) ? Math.max(5, Math.min(17, 4 + 13 * Math.sqrt(pop / 4500000))) : 6;
  const s = Math.round(r * 2);
  return L.divIcon({ html: '<div class="mk-town" style="width:' + s + 'px;height:' + s + 'px;background:#2563eb"></div>',
    className: 'mk-icon', iconSize: [s, s], iconAnchor: [s / 2, s / 2] });
}
function industryIcon(p) {
  const s = 20;
  return L.divIcon({ html: '<div style="width:' + (s - 6) + 'px;height:' + (s - 6) + 'px;background:#b45309;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.4);transform:rotate(45deg);margin:3px"></div>',
    className: 'mk-icon', iconSize: [s, s], iconAnchor: [s / 2, s / 2] });
}
function clusterIcon(color) {
  return function (cluster) {
    const n = cluster.getChildCount();
    const size = n < 10 ? 34 : n < 100 ? 42 : 52;
    return L.divIcon({ html: '<div class="mk-cluster" style="width:' + size + 'px;height:' + size + 'px;background:' + color + '"><span>' + n + '</span></div>',
      className: 'mk-icon', iconSize: [size, size] });
  };
}

/* ============================== data loading ============================== */
async function loadRiverData(river) {
  if (state.data[river]) return state.data[river];
  const R = RIVERS[river], d = R.dir, F = R.files;
  const [drains, stps, wq, people, courses, industries, riverGeo, corridor, population] = await Promise.all([
    fetchJSON(d + '/' + F.drains), fetchJSON(d + '/' + F.stps), fetchJSON(d + '/' + F.wq),
    fetchJSON(d + '/' + F.people), fetchJSON(d + '/' + F.courses), fetchJSON(d + '/' + F.industries),
    fetchJSON(d + '/' + F.river), fetchJSON(d + '/' + F.corridor), fetchJSON(d + '/' + F.population),
  ]);
  const data = { drains, stps, wq, people, courses, industries, riverGeo, corridor, population };
  // normalise string booleans from the source GeoJSON ("True"/"False"/"")
  // to real booleans/null — the files carry them as strings, while every
  // downstream check uses strict === true / === false. Without this, no
  // plant ever matches "fails NGT" (the action list lost all 12 STP rows)
  // and no plant ever matches "meets NGT" (all markers render grey).
  const normBool = (v) => v === 'True' ? true : v === 'False' ? false : v === '' ? null : v;
  stps.features.forEach((f) => {
    f.properties.ngt_compliant = normBool(f.properties.ngt_compliant);
    f.properties.moefcc_compliant = normBool(f.properties.moefcc_compliant);
  });
  drains.features.forEach((f) => { f.properties.tapped = normBool(f.properties.tapped); });
  // stamp every plotted feature with its river id — cards and the action
  // list must know which river an item belongs to, whatever the filter is
  ['drains', 'stps', 'wq', 'people', 'courses', 'industries'].forEach((k) => {
    data[k].features.forEach((f) => { f.properties._river = river; });
  });
  // merge per-year water-quality series from the CSV (the geojson carries latest values only)
  try {
    const wqCsv = parseCSV(await fetchText(d + '/water_quality.csv'));
    const byCode = {};
    wqCsv.forEach((r) => { byCode[r.station_code] = r; });
    wq.features.forEach((f) => {
      const row = byCode[f.properties.station_code];
      if (!row) return;
      for (let y = 2014; y <= 2025; y++) {
        ['bod_', 'do_', 'ph_'].forEach((pfx) => {
          const v = row[pfx + y];
          if (v !== undefined && v !== '' && v != null) f.properties[pfx + y] = +v;
        });
      }
    });
  } catch (e) { /* series stays latest-only */ }
  if (river === 'yamuna' || river === 'sabarmati' || river === 'cauvery') {
    const budgets = parseCSV(await fetchText(d + '/stp_budgets.csv'));
    budgets.forEach((b) => { state.stpBudgetById[b.stp_id] = b; });
  }
  state.data[river] = data;
  return data;
}
function plottedCount(fc) { return fc.features.filter((f) => f.geometry).length; }

/* ============================== layer building ============================== */
function clearLayers() {
  Object.values(state.layers).forEach((l) => { if (l && map.hasLayer(l)) map.removeLayer(l); });
  state.layers = {};
}
function shortcomingFilter(kind, p) {
  if (!state.shortcomingsOnly) return true;
  if (kind === 'drain') return !(p.tapped === true || p.tapped_status === 'Tapped');
  if (kind === 'stp') return p.ngt_compliant === false;
  if (kind === 'wq') { const b = +p.bod_latest; return !isNaN(b) && b > 3; }
  if (kind === 'town') return townShortfall(p._river, p.town) > 0;
  if (kind === 'course') return p.tapped_status !== 'Tapped';
  return true;
}
function townStats(river, town) {
  const R = state.data[river];
  const drains = R.drains.features.filter((f) => f.properties.town === town);
  const stps = R.stps.features.filter((f) => f.properties.town === town);
  const untapped = drains.filter((f) => f.properties.tapped !== true)
    .reduce((s, f) => s + (+f.properties.flow_mld || 0), 0);
  const capacity = stps.reduce((s, f) => s + (+f.properties.capacity_mld || 0), 0);
  const utilised = stps.reduce((s, f) => s + (+f.properties.utilised_mld || 0), 0);
  const assessed = stps.filter((f) => f.properties.ngt_compliant === true || f.properties.ngt_compliant === false);
  const compliant = stps.filter((f) => f.properties.ngt_compliant === true).length;
  return { drains: drains.length, untapped, capacity, utilised, stps: stps.length, compliant, assessed: assessed.length };
}
function townShortfall(river, town) {
  const t = townStats(river, town);
  return Math.max(0, t.untapped - t.capacity);
}

function buildLayers() {
  clearLayers();
  const L_ = {};
  state.townIndex = {};
  // --- river lines (always on) + corridors (per layer rule) ---
  const riverLines = [], corridors = [];
  activeRivers().forEach((river) => {
    const data = state.data[river];
    riverLines.push(L.geoJSON(data.riverGeo, { style: { color: '#1d4ed8', weight: 3.5, opacity: 0.9 } }));
    corridors.push(L.geoJSON(data.corridor, { style: { color: '#3b82f6', weight: 1, fillColor: '#3b82f6', fillOpacity: 0.05 } }));
  });
  L_.river = L.layerGroup(riverLines).addTo(map);
  L_.corridor = L.layerGroup(corridors);
  // --- drains (clustered) ---
  const dc = L.markerClusterGroup({ iconCreateFunction: clusterIcon('#b91c1c'), disableClusteringAtZoom: 12, maxClusterRadius: 55 });
  activeRivers().forEach((river) => {
    const R = RIVERS[river], data = state.data[river];
    data.drains.features.forEach((f) => {
      if (!f.geometry || !shortcomingFilter('drain', f.properties)) return;
      const m = L.marker([f.geometry.coordinates[1], f.geometry.coordinates[0]], { icon: dropletIcon(f.properties, R.maxDrainLoad) });
      m.on('click', () => showDrain(f.properties));
      m.bindTooltip('<b>' + esc(f.properties.name) + '</b><br>' + esc(f.properties.town) + ' · ' + num(f.properties.bod_load_tpd) + ' t/day BOD');
      dc.addLayer(m);
    });
  });
  L_.drains = dc;
  // --- STPs (clustered) ---
  const sc = L.markerClusterGroup({ iconCreateFunction: clusterIcon('#6d28d9'), disableClusteringAtZoom: 12, maxClusterRadius: 55 });
  activeRivers().forEach((river) => {
    const R = RIVERS[river], data = state.data[river];
    // plants at one town share a centroid — spread duplicates on a tiny
    // spiral (~20 m steps) so each marker, including a compliant plant
    // hidden behind failing ones, can be tapped
    const byCoord = {};
    data.stps.features.forEach((f) => {
      if (!f.geometry) return;
      const k = f.geometry.coordinates[0] + ',' + f.geometry.coordinates[1];
      (byCoord[k] = byCoord[k] || []).push(f);
    });
    Object.values(byCoord).forEach((group) => {
      group.forEach((f, i) => {
        if (!shortcomingFilter('stp', f.properties)) return;
        let lat = f.geometry.coordinates[1], lng = f.geometry.coordinates[0];
        if (group.length > 1) {
          const a = i * 2.399, r = 0.00018 * (1 + Math.floor(i / 2) * 0.6);
          lat += Math.sin(a) * r; lng += Math.cos(a) * r;
        }
        const m = L.marker([lat, lng], { icon: stpIcon(f.properties, R.maxStpCap) });
        m.on('click', () => showStp(f.properties));
        m.bindTooltip('<b>' + esc(f.properties.plant_name) + '</b><br>' + esc(f.properties.town) + ' · ' + num(f.properties.capacity_mld, 0) + ' MLD');
        sc.addLayer(m);
      });
    });
  });
  L_.stps = sc;
  // --- water quality (clustered) ---
  const wc = L.markerClusterGroup({ iconCreateFunction: clusterIcon('#0369a1'), disableClusteringAtZoom: 12, maxClusterRadius: 55 });
  activeRivers().forEach((river) => {
    const data = state.data[river];
    data.wq.features.forEach((f) => {
      if (!f.geometry || !shortcomingFilter('wq', f.properties)) return;
      const m = L.marker([f.geometry.coordinates[1], f.geometry.coordinates[0]], { icon: wqIcon(f.properties) });
      m.on('click', () => showWq(f.properties));
      m.bindTooltip('<b>' + esc(f.properties.station) + '</b><br>BOD ' + num(f.properties.bod_latest) + ' mg/l (limit 3)');
      wc.addLayer(m);
    });
  });
  L_.wq = wc;
  // --- towns (clustered) ---
  const tc = L.markerClusterGroup({ iconCreateFunction: clusterIcon('#2563eb'), disableClusteringAtZoom: 10, maxClusterRadius: 60 });
  activeRivers().forEach((river) => {
    const data = state.data[river];
    data.people.features.forEach((f) => {
      if (!f.geometry) return;
      state.townIndex[f.properties.town + ' · ' + riverLabel(river)] = { river, props: f.properties };
      if (!shortcomingFilter('town', f.properties)) return;
      const m = L.marker([f.geometry.coordinates[1], f.geometry.coordinates[0]], { icon: townIcon(f.properties) });
      m.on('click', () => showTown(f.properties));
      m.bindTooltip('<b>' + esc(f.properties.town) + '</b><br>pop. ' + num0(f.properties.population_2011) + ' (2011)');
      tc.addLayer(m);
    });
  });
  L_.towns = tc;
  // --- drain courses ---
  const courseLayers = [];
  activeRivers().forEach((river) => {
    const data = state.data[river];
    courseLayers.push(L.geoJSON(data.courses, { style: (f) => {
      const load = +f.properties.bod_load_tpd || 0;
      return { color: load > 50 ? '#991b1b' : load > 10 ? '#dc2626' : '#ea580c',
               weight: Math.max(2, Math.min(6, 2 + load / 40)), opacity: 0.85,
               dashArray: (f.properties.course_status && /approx/i.test(f.properties.course_status)) ? '7 5' : null };
    }, onEachFeature: (f, l) => { l.on('click', () => showCourse(f.properties)); l.bindTooltip('<b>' + esc(f.properties.drain_name) + '</b><br>' + num(f.properties.bod_load_tpd) + ' t/day BOD · ' + num(f.properties.course_length_km) + ' km'); } }));
  });
  L_.courses = L.layerGroup(courseLayers);
  // --- industries ---
  const industryLayers = [];
  activeRivers().forEach((river) => {
    const data = state.data[river];
    industryLayers.push(L.geoJSON(data.industries, { pointToLayer: (f, ll) => {
      const m = L.marker(ll, { icon: industryIcon(f.properties) });
      m.on('click', () => showIndustry(f.properties));
      m.bindTooltip('<b>' + esc(f.properties.name) + '</b><br>' + esc(f.properties.industry_type || ''));
      return m;
    } }));
  });
  L_.industries = L.layerGroup(industryLayers);
  state.layers = L_;
  applyLayers();
}
function applyLayers() {
  const L_ = state.layers, a = state.activeLayer;
  const show = (key, layer) => {
    const want = a === 'all' || a === key;
    if (want && !map.hasLayer(layer)) layer.addTo(map);
    if (!want && map.hasLayer(layer)) map.removeLayer(layer);
  };
  if (L_.drains) show('drains', L_.drains);
  if (L_.stps) show('stps', L_.stps);
  if (L_.wq) show('wq', L_.wq);
  if (L_.towns) show('towns', L_.towns);
  if (L_.courses) show('courses', L_.courses);
  if (L_.industries) show('industries', L_.industries);
  if (L_.corridor) show('corridor', L_.corridor);
  updateLayerChips();
  updateLayerLegends();
  updateLayerNote();
}

/* ============================== layer UI ============================== */
const LAYER_DEFS = [
  { key: 'drains', label: 'Drains', color: '#dc2626' },
  { key: 'stps', label: 'Treatment plants', color: '#6d28d9' },
  { key: 'wq', label: 'Water quality', color: '#0369a1' },
  { key: 'towns', label: 'Towns & people', color: '#2563eb' },
  { key: 'courses', label: 'Drain courses', color: '#ea580c' },
  { key: 'industries', label: 'Industries', color: '#b45309' },
  { key: 'corridor', label: '10 km corridor', color: '#3b82f6' },
];
const LAYER_LEGENDS = {
  drains: '<b>Drains</b> · size = BOD load · amber → red = worse · faded = estimated · green = tapped',
  stps: '<b>Plants</b> · size = capacity (MLD) · green meets NGT norms · red fails · grey not assessed',
  wq: '<b>Water quality</b> · colour = latest BOD vs the 3 mg/l bathing limit · green within · red over · grey no reading',
  towns: '<b>Towns</b> · size = population (2011) · tap for people &amp; MLA',
  courses: '<b>Drain courses</b> · the drain&rsquo;s full stretch to the river · dashed = approximate',
  industries: '<b>Industries</b> · diamond · letters = type · position approximate',
  corridor: '<b>10 km corridor</b> · shaded land within 10 km of the river',
};
function updateLayerChips() {
  const el = $('#layerChips');
  el.innerHTML = '<button class="chip' + (state.activeLayer === 'all' ? ' active' : '') + '" data-layer="all" type="button">All layers</button>' +
    LAYER_DEFS.map((d) => '<button class="chip' + (state.activeLayer === d.key ? ' active' : '') + '" data-layer="' + d.key + '" type="button"><span class="dot" style="background:' + d.color + '"></span>' + d.label + '</button>').join('');
  el.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => {
    state.activeLayer = c.getAttribute('data-layer');
    applyLayers();
  }));
}
function updateLayerLegends() {
  const el = $('#layerLegends');
  if (state.activeLayer === 'all') { el.innerHTML = ''; return; }
  el.innerHTML = '<div class="ll">' + (LAYER_LEGENDS[state.activeLayer] || '') + '</div>';
}
function updateLayerNote() {
  const rivers = activeRivers().filter((r) => state.data[r]);
  if (!rivers.length) { $('#layerNote').textContent = ''; return; }
  const counts = { drains: 0, stps: 0, wq: 0, towns: 0, courses: 0, industries: 0 };
  rivers.forEach((river) => {
    const R = state.data[river];
    counts.drains += plottedCount(R.drains); counts.stps += plottedCount(R.stps); counts.wq += plottedCount(R.wq);
    counts.towns += plottedCount(R.people); counts.courses += R.courses.features.length; counts.industries += R.industries.features.length;
  });
  $('#layerNote').textContent = state.activeLayer === 'all'
    ? counts.drains + ' drains · ' + counts.stps + ' plants · ' + counts.wq + ' stations · ' + counts.towns + ' towns on the map'
    : counts[state.activeLayer] + ' shown';
}
function renderLegend() {
  const maxLoad = Math.max.apply(null, activeRivers().map((r) => RIVERS[r].maxDrainLoad));
  const drop = (fill, size, op) => '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24"><path d="M12 2.2C12 2.2 5.4 10.1 5.4 14.7a6.6 6.6 0 0 0 13.2 0C18.6 10.1 12 2.2 12 2.2Z" fill="' + fill + '"' + (op ? ' fill-opacity="' + op + '"' : '') + '/></svg>';
  const tank = (fill, size) => '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.4" fill="' + fill + '"/><circle cx="12" cy="12" r="6.1" fill="#fff" fill-opacity="0.3"/><line x1="12" y1="12" x2="12" y2="3.4" stroke="#fff" stroke-width="1.7"/><circle cx="12" cy="12" r="1.7" fill="#fff"/></svg>';
  const dot = (fill, size) => '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="' + fill + '"/></svg>';
  $('#legendPanel').innerHTML =
    '<h4>How to read the map</h4>' +
    '<div class="lg-row"><span class="swatch">' + drop('#dc2626', 20) + '</span><span><b>Drains</b><span class="lg-minis">' +
    '<span class="lg-mini">' + drop('#f59e0b', 14) + '<i>low load</i></span>' +
    '<span class="lg-mini">' + drop('#dc2626', 22) + '<i>high load</i></span>' +
    '<span class="lg-mini">' + drop('#dc2626', 18, 0.35) + '<i>estimated</i></span>' +
    '<span class="lg-mini">' + drop('#16a34a', 18) + '<i>tapped</i></span></span>' +
    '<span class="lg-cap">Size = BOD load &middot; green = tapped, never &ldquo;clean&rdquo;</span></span></div>' +
    '<div class="lg-row"><span class="swatch">' + tank('#9ca3af', 20) + '</span><span><b>Treatment plants</b><span class="lg-minis">' +
    '<span class="lg-mini">' + tank('#16a34a', 20) + '<i>meets NGT</i></span>' +
    '<span class="lg-mini">' + tank('#dc2626', 20) + '<i>fails</i></span>' +
    '<span class="lg-mini">' + tank('#9ca3af', 20) + '<i>not assessed</i></span></span>' +
    '<span class="lg-cap">Size = capacity (MLD)</span></span></div>' +
    '<div class="lg-row"><span class="swatch">' + dot('#16a34a', 18) + '</span><span><b>Water quality</b><span class="lg-minis">' +
    '<span class="lg-mini">' + dot('#16a34a', 16) + '<i>within 3 mg/l</i></span>' +
    '<span class="lg-mini">' + dot('#dc2626', 16) + '<i>over limit</i></span>' +
    '<span class="lg-mini">' + dot('#9ca3af', 16) + '<i>no reading</i></span></span>' +
    '<span class="lg-cap">Latest BOD vs the 3 mg/l bathing limit</span></span></div>' +
    '<div class="lg-row"><span class="swatch">' + dot('#2563eb', 18) + '</span><span><b>Towns</b><span class="lg-minis">' +
    '<span class="lg-mini">' + dot('#2563eb', 10) + '<i>small</i></span>' +
    '<span class="lg-mini">' + dot('#2563eb', 22) + '<i>large</i></span></span>' +
    '<span class="lg-cap">Size = population (2011) &middot; tap for people &amp; MLA</span></span></div>' +
    '<div class="lg-row"><span class="swatch">◆</span><span><b>Industries</b> &mdash; diamond, position approximate</span></div>' +
    '<div class="legend-scale">' +
    [1, 10, 50, 260].map((v) => {
      const s = Math.round(13 + 26 * Math.sqrt(Math.min(v, maxLoad) / maxLoad));
      return '<span class="sc">' + drop('#dc2626', s) + '<br>' + v + ' t/day</span>';
    }).join('') + '</div>' +
    '<p style="font-size:12px;color:var(--muted);margin:4px 0 0">Drain load, tonnes per day. Zoom in: clusters split into single points. Plant locations are town centroids &mdash; no public source gives plant-site coordinates.</p>';
}
$('#legendBtn').addEventListener('click', () => {
  const p = $('#legendPanel');
  const open = p.hidden;
  p.hidden = !open;
  $('#legendBtn').setAttribute('aria-expanded', String(open));
  if (open) renderLegend();
});

/* ============================== detail panel ============================== */
function openPanel(html) {
  $('#panelContent').innerHTML = html;
  $('#detailPanel').hidden = false;
  collapsePanelOnMobile();
}
function collapsePanelOnMobile() {
  if (window.innerWidth <= 760) {
    $('#controlPanel').classList.remove('open');
    $('#panelToggle').setAttribute('aria-expanded', 'false');
    $('#panelToggle').textContent = 'Controls';
  }
}
$('#panelToggle').addEventListener('click', () => {
  const panel = $('#controlPanel');
  const open = panel.classList.toggle('open');
  $('#panelToggle').setAttribute('aria-expanded', open ? 'true' : 'false');
  $('#panelToggle').textContent = open ? 'Hide controls' : 'Controls';
});
$('#panelClose').addEventListener('click', () => { $('#detailPanel').hidden = true; });
function srcLine(source, asOf) {
  return '<p class="src">Source: ' + esc(source || '—') + (asOf ? ' · as of ' + esc(asOf) : '') + '. <a href="#" onclick="switchTab(\'data\');return false;">See methodology &amp; sources</a></p>';
}
function takeaway(text) { return '<p class="takeaway">' + text + '</p>'; }
function actionBox(what, who) {
  return '<div class="callout"><strong>What needs to happen:</strong> ' + esc(what) +
    '<br><strong>Who is responsible:</strong> ' + esc(who) + '</div>';
}
function explainerBOD() {
  return '<p class="note-box"><b>BOD</b> — Biochemical Oxygen Demand: the oxygen microbes need to break down the organic pollution in water. Higher BOD = more polluted. Bathing standard: 3 mg/l or less.</p>';
}
function showDrain(p) {
  const R = RIVERS[p._river];
  const load = +p.bod_load_tpd;
  const measured = p.data_status === 'measured';
  const statusBadge = p.tapped === true ? '<span class="badge green">Tapped — intercepted</span>'
    : p.tapped_status === 'Partially tapped' ? '<span class="badge amber">Partially tapped</span>'
    : '<span class="badge red">Untapped — flows straight into the river</span>';
  const take = !measured
    ? 'This drain has never been measured. Its load is ' + (p.data_status === 'estimated' ? 'estimated from the town&rsquo;s population' : 'unknown') + ' — the gap itself is a finding.'
    : load >= 50 ? 'One of the worst drains on this river — ' + num(load) + ' tonnes of BOD a day, ' + (p.tapped === true ? 'partly intercepted' : 'entirely untapped') + '.'
    : load >= 10 ? 'A large drain — ' + num(load) + ' tonnes of BOD a day into the river.'
    : 'A small drain by load — ' + num(load) + ' tonnes of BOD a day. Small, but still raw sewage: a drain is never green.';
  let html = '<h2>' + esc(p.name) + '</h2><p class="sub">' + esc(p.town) + ' · ' + esc(p.state) + ' · ' + esc(p.source_type || '') + ' · ' + esc(p.river || '') + '</p>';
  html += takeaway(take);
  html += '<p>' + statusBadge + ' <span class="badge ' + (measured ? 'green' : p.data_status === 'estimated' ? 'amber' : 'grey') + '">' + esc(p.data_status || 'unknown') + '</span></p>';
  html += '<div class="kv">' +
    '<div class="cell"><div class="k">Flow</div><div class="v">' + num(p.flow_mld) + ' <small>MLD</small></div></div>' +
    '<div class="cell"><div class="k">BOD load added</div><div class="v">' + num(load) + ' <small>t/day</small></div></div>' +
    '<div class="cell"><div class="k">BOD concentration</div><div class="v">' + num(p.bod_mg_l) + ' <small>mg/l</small></div></div>' +
    '<div class="cell"><div class="k">COD</div><div class="v">' + num(p.cod_mg_l) + ' <small>mg/l</small></div></div></div>';
  if (measured) html += '<div class="chart-title">Load vs the biggest drain on this river (' + num(R.maxDrainLoad) + ' t/day)</div>' + hbarRow('This drain', load, R.maxDrainLoad, '#dc2626', num(load) + ' t/day', 'This drain adds ' + num(load) + ' tonnes of BOD a day · biggest drain on the ' + R.label + ': ' + num(R.maxDrainLoad) + ' t/day');
  if (p.data_status === 'estimated') html += '<p class="flag">Estimated load — ' + esc(p.estimation_method || 'apportioned from the town\u2019s estimated sewage (population × 185 litres per person per day × 0.8), shared equally across the town\u2019s unmeasured drains.') + '</p>';
  if (p.data_status === 'unmeasured') html += '<p class="flag">Never measured — the CPCB drain report lists this drain with no flow and no load. Its pollution is unquantified.</p>';
  html += actionBox(
    p.tapped === true ? 'Keep the interception working and make sure the diverted sewage actually reaches a working treatment plant.'
      : 'Intercept and tap this drain into the sewer network, and treat the flow before it reaches the river.',
    p.town + ' municipal body + ' + (R.stateAgency[p.state] || STATE_AGENCY_DEFAULT) + ' + State Pollution Control Board');
  html += explainerBOD();
  html += srcLine(p.source, p.as_of);
  openPanel(html);
}
function complianceBadge(p) {
  if (p.ngt_compliant === true) return '<span class="badge green">Meets NGT norms</span>';
  if (p.ngt_compliant === false) return '<span class="badge red">Fails NGT norms</span>';
  return '<span class="badge grey">Not assessed</span>';
}
function effluentBars(p) {
  const lim = [['BOD', +p.effluent_bod_mg_l, 10, 'mg/l'], ['COD', +p.effluent_cod_mg_l, 50, 'mg/l'],
    ['TSS', +p.effluent_tss_mg_l, 20, 'mg/l'], ['Faecal coliform', +p.effluent_fc_mpn_100ml, 230, 'MPN/100 ml']];
  let h = '<div class="chart-title">Outlet quality vs NGT metro-tier limits</div>';
  lim.forEach(([label, v, l, unit]) => {
    if (v == null || isNaN(v)) { h += '<div class="hbar-row"><span>' + label + '</span><span style="color:var(--muted);font-size:13px">not published</span><span></span></div>'; return; }
    const verdict = v > l ? 'OVER the limit by ' + num(v - l) + ' ' + unit : 'within the limit';
    h += hbarRow(label + ' (limit ' + l + ')', Math.min(v, l * 3), l * 3, v > l ? '#dc2626' : '#16a34a', num(v) + ' ' + unit,
      label + ': ' + num(v) + ' ' + unit + ' at the outlet vs the NGT metro-tier limit of ' + l + ' ' + unit + ' — ' + verdict);
  });
  h += '<p class="chart-sub">No per-plant total nitrogen value is published anywhere.</p>';
  return h;
}
function showStp(p) {
  const R = RIVERS[p._river];
  const isNew = p.is_new_plant === true;
  const util = p.utilisation_pct != null ? +p.utilisation_pct : (p.capacity_mld && p.utilised_mld != null ? (+p.utilised_mld / +p.capacity_mld) * 100 : null);
  let html = '<h2>' + esc(p.plant_name) + '</h2><p class="sub">' + esc(p.town) + ' · ' + esc(p.state) + ' · ' + esc(p.technology || '') + (isNew ? ' · <b>commissioned 2024–2026</b>' : '') + '</p>';
  const take = p.ngt_compliant === true ? 'One of the few plants that meets NGT norms — ' + (p._river === 'ganga' ? 'only 19 of 145 plants on the Ganga do.' : p._river === 'yamuna' ? 'only 3 of 115 plants on the Yamuna do.' : 'the first on the Sabarmati to do so.')
    : p.ngt_compliant === false ? 'Fails NGT norms' + (p.noncompliance_reason ? ' — ' + esc(p.noncompliance_reason) : '.') + ' Treated sewage that is still too dirty to meet the standard.'
    : 'Never assessed against NGT norms — its outlet quality is not publicly graded.';
  html += takeaway(take);
  html += '<p>' + complianceBadge(p) + ' <span class="badge ' + (p.operational_status === 'operational' ? 'green' : 'grey') + '">' + esc(p.operational_status || 'status unknown') + '</span></p>';
  html += '<div class="kv">' +
    '<div class="cell"><div class="k">Capacity</div><div class="v">' + num(p.capacity_mld, 0) + ' <small>MLD</small></div></div>' +
    '<div class="cell"><div class="k">Actually treated</div><div class="v">' + num(p.utilised_mld, 0) + ' <small>MLD</small></div></div>' +
    '<div class="cell"><div class="k">Utilisation</div><div class="v">' + (util != null ? Math.round(util) + '<small>%</small>' : '—') + '</div></div>' +
    '<div class="cell"><div class="k">Meets MoEFCC 2017</div><div class="v" style="font-size:14px">' + (p.moefcc_compliant === true ? 'Yes' : p.moefcc_compliant === false ? 'No' : 'Not assessed') + '</div></div></div>';
  if (util != null) html += hbarRow('Utilisation', Math.min(util, 100), 100, util < 50 ? '#dc2626' : util < 75 ? '#ea580c' : '#16a34a', Math.round(util) + '% of capacity',
    'Utilisation: ' + Math.round(util) + '% of ' + num(p.capacity_mld, 0) + ' MLD capacity — ' + num(p.utilised_mld, 0) + ' MLD actually treated');
  if (p.effluent_bod_mg_l != null || p.effluent_cod_mg_l != null) html += effluentBars(p);
  else if (p._river === 'ganga') html += '<p class="note-box">No effluent values published for this plant.</p>';
  else if (p._river === 'sabarmati') html += '<p class="note-box">No effluent values are published for Sabarmati plants — the one exception is Vasna 126 (outlet BOD 44.8 mg/l, World Bank ESIA). Compliance here is graded only from the March 2021 MPR flag.</p>';
  else if (p._river === 'cauvery') html += '<p class="note-box">No effluent values are published for any Cauvery plant — no per-plant outlet BOD is available, so NGT compliance cannot be shown for any of the 68 plants. This is a data limit, not a finding that plants fail. Compliance is graded only from the MPR &ldquo;Complied&rdquo; flag, which means the plant meets the consent standard (BOD 20 mg/l, MoEFCC 2017).</p>';

  if (p._river === 'ganga') {
    /* ---- Ganga accountability (stp_accountability.csv fields) ---- */
    const opFlag = p.operator_name ? '' : ' <span class="badge grey">operator undisclosed</span>';
    const unconfirmed = (p.data_flags && /state-pattern|HAM-scope|unconfirmed/i.test(p.data_flags)) || p.operator_type === 'state-pattern';
    html += '<h4>Who operates it</h4>';
    html += '<p>' + (p.operator_name ? '<b>' + esc(p.operator_name) + '</b>' : 'Not publicly disclosed') + opFlag +
      (unconfirmed ? ' <span class="badge amber">per-plant unconfirmed — state pattern</span>' : '') + '</p>';
    if (p.concessionaire) html += '<p style="font-size:13.5px">Concession: ' + esc(p.concessionaire) + (p.concession_years ? ' · ' + esc(p.concession_years) + '-year O&amp;M' : '') + '</p>';
    html += '<h4>What it cost &amp; what it costs to run</h4>';
    const cost = fmtCrore(p.sanctioned_cost_crore);
    html += '<div class="kv">' +
      '<div class="cell"><div class="k">Sanctioned build cost</div><div class="v" style="font-size:14px">' + (cost || 'Not publicly disclosed') + '</div></div>' +
      '<div class="cell"><div class="k">Annual running budget (O&amp;M)</div><div class="v" style="font-size:14px">' + (fmtCrore(p.annual_om_crore) || 'Not publicly disclosed') + '</div></div></div>';
    if (!p.annual_om_crore) html += '<p class="note-box">Only 27 of the 145 plants publish an annual O&amp;M figure — all of them in Uttar Pradesh. The other 118 do not disclose one.</p>';
    html += '<p style="font-size:13.5px"><b>Funds released vs utilised:</b> published for <b>0 of 145</b> plants. That non-disclosure is itself a finding — the money trail cannot be checked from public sources.</p>';
    if (p.contractor_name) html += '<p style="font-size:13.5px"><b>Contractor:</b> ' + esc(p.contractor_name) + (p.award_date ? ' · awarded ' + esc(p.award_date) : '') + '</p>';
    else html += '<p style="font-size:13.5px"><b>Contractor:</b> not published (only 5 of 145 plants name one).</p>';
    if (p.project_status) html += '<p style="font-size:13.5px"><b>Project status:</b> ' + esc(p.project_status) + (p.scheduled_completion ? ' · scheduled completion ' + esc(p.scheduled_completion) : '') + '</p>';
    html += '<h4>Who built it · who runs it now</h4>';
    const built = p.build_year ? (p.build_basis === 'sanctioned' ? 'sanctioned ' : '') + p.build_year : 'year not published';
    html += '<p style="font-size:14px"><b>Built under:</b> ' + esc(p.built_party_state || 'party not established') + ', ' + esc(built) +
      (p.built_party_centre ? ' · Centre: ' + esc(p.built_party_centre) : '') + '<br><b>Managed now:</b> ' + esc(p.operator_name || 'operator undisclosed') + ' under ' + esc(p.managed_party_state || 'party not established') + ' (2026)</p>';
    html += actionBox(
      p.ngt_compliant === false ? 'Bring the outlet within NGT norms — fix the failing parameter (' + esc(p.noncompliance_reason || 'see effluent readings') + ') — and publish the plant\u2019s O&M spending.'
        : p.ngt_compliant === true ? 'Keep it compliant, and publish its O&M spending so the good performance can be checked.'
        : 'Assess this plant against NGT norms and publish its outlet readings.',
      (p.operator_name || 'Plant operator') + ' · ' + (R.stateAgency[p.state] || STATE_AGENCY_DEFAULT) + ' · State Pollution Control Board enforces outlet norms set by CPCB');
    html += srcLine(p.cpcb_source || 'CPCB National Inventory of STPs, Mar 2021 + NGRBA state reports', p.as_of);
  } else {
    /* ---- Yamuna budget (stp_budgets.csv; NO party attribution exists) ---- */
    const b = state.stpBudgetById[p.id] || {};
    const cost = fmtCrore(b.sanctioned_cost_crore);
    html += '<h4>Budget &amp; contract</h4>';
    html += '<p style="font-size:14px"><b>Sanctioned build cost:</b> ' + (cost || 'Not publicly disclosed') + '</p>';
    if (b.contractor_name) html += '<p style="font-size:13.5px"><b>Contractor:</b> ' + esc(b.contractor_name) + '</p>';
    else html += '<p style="font-size:13.5px"><b>Contractor:</b> not published.</p>';
    html += '<p style="font-size:13.5px"><b>Funds released vs utilised:</b> ' + (b.funds_released_crore || b.funds_utilised_crore ? 'released ' + fmtCrore(b.funds_released_crore) + ' · utilised ' + fmtCrore(b.funds_utilised_crore) : 'not published per plant') + '</p>';
    html += '<p class="note-box">' + (p._river === 'sabarmati'
      ? 'None of the 24 Sabarmati plants discloses any budget figure — no sanctioned cost, funds released/utilised, contractor or award date is published for any of them. No party attribution (who built it / who manages it now) has been compiled for Sabarmati plants either — those lines are shown only for Ganga plants, never guessed.'
      : p._river === 'cauvery'
      ? 'None of the 68 Cauvery plants discloses any budget figure — no sanctioned cost, funds released/utilised, contractor or award date is published for any of them. No party attribution (who built it / who manages it now) has been compiled for Cauvery plants either — those lines are shown only for Ganga plants, never guessed.'
      : 'Only 2 of the 115 Yamuna plants fully disclose their budget, 36 partially, 77 not at all. No party attribution (who built it / who manages it now) has been compiled for Yamuna plants — those lines are shown only for Ganga plants, never guessed.') + '</p>';
    html += actionBox(
      p.ngt_compliant === false ? 'Bring the outlet within NGT norms and publish the plant\u2019s budget and O&M spending.'
        : 'Keep it compliant, and publish its budget and O&M spending so the performance can be checked.',
      'Plant operator under ' + (p.state === 'Delhi' ? 'Delhi Jal Board' : R.stateAgency[p.state] || STATE_AGENCY_DEFAULT) + ' · State Pollution Control Board enforces outlet norms set by CPCB');
    html += srcLine(p.source, p.as_of);
  }
  html += '<p class="note-box">All plant locations on this map are town centroids — no public source gives plant-site coordinates.</p>';
  openPanel(html);
}
function showWq(p) {
  const bod = +p.bod_latest, doV = +p.do_latest;
  const over = !isNaN(bod) && bod > 3;
  let html = '<h2>' + esc(p.station) + '</h2><p class="sub">' + esc(p.state) + ' · water-quality station · ' + esc(p.source || 'Ganga Knowledge Portal') + '</p>';
  html += takeaway(isNaN(bod) ? 'No recent BOD reading published for this station.'
    : over ? 'Latest BOD ' + num(bod) + ' mg/l — ' + Math.round(bod / 3 * 10) / 10 + '× the 3 mg/l bathing standard. This stretch is not safe for bathing.'
    : 'Latest BOD ' + num(bod) + ' mg/l — within the 3 mg/l bathing standard.');
  html += '<div class="kv">' +
    '<div class="cell"><div class="k">BOD — latest (' + esc(p.bod_latest_year || '') + ')</div><div class="v">' + num(bod) + ' <small>mg/l</small></div></div>' +
    '<div class="cell"><div class="k">DO — latest (' + esc(p.do_latest_year || '') + ')</div><div class="v">' + num(doV) + ' <small>mg/l</small></div></div>' +
    '<div class="cell"><div class="k">pH — latest</div><div class="v">' + num(p.ph_latest) + '</div></div>' +
    '<div class="cell"><div class="k">Faecal coliform — latest</div><div class="v" style="font-size:14px">' + num(p.fc_latest, 0) + ' <small>MPN/100 ml</small></div></div></div>';
  if (!isNaN(bod)) html += '<div class="chart-title">BOD vs the 3 mg/l bathing standard</div>' + hbarRow('BOD', Math.min(bod, 12), 12, over ? '#dc2626' : '#16a34a', num(bod) + ' mg/l',
    'BOD ' + num(bod) + ' mg/l vs the 3 mg/l bathing standard — ' + (over ? Math.round(bod / 3 * 10) / 10 + '× the limit' : 'within the limit'));
  if (!isNaN(doV)) html += hbarRow('DO (fish need ≥ 5)', Math.min(doV, 10), 10, doV < 5 ? '#dc2626' : '#16a34a', num(doV) + ' mg/l',
    'Dissolved oxygen ' + num(doV) + ' mg/l — fish need 5 mg/l or more, ' + (doV < 5 ? 'this stretch is below it' : 'this stretch is above it'));
  if (p.bod_earliest != null && p.bod_latest != null) {
    html += '<div class="chart-title">Change since ' + esc(p.bod_earliest_year) + '</div>' +
      hbarRow('Then (' + p.bod_earliest_year + ')', +p.bod_earliest, Math.max(+p.bod_earliest, +p.bod_latest, 3), '#94a3b8', num(p.bod_earliest) + ' mg/l',
        'BOD in ' + p.bod_earliest_year + ': ' + num(p.bod_earliest) + ' mg/l') +
      hbarRow('Now (' + p.bod_latest_year + ')', +p.bod_latest, Math.max(+p.bod_earliest, +p.bod_latest, 3), over ? '#dc2626' : '#16a34a', num(p.bod_latest) + ' mg/l',
        'BOD in ' + p.bod_latest_year + ': ' + num(p.bod_latest) + ' mg/l — ' + esc(p.bod_trend || '')) +
      '<p class="chart-sub">Trend: <b>' + esc(p.bod_trend || '—') + '</b> (' + (p.bod_change_pct != null ? (+p.bod_change_pct > 0 ? '+' : '') + p.bod_change_pct + '%' : 'change not computed') + ')</p>';
  }
  {
    const years = p._river === 'yamuna' ? [2021, 2022, 2023, 2024, 2025] : p._river === 'sabarmati' ? [2018, 2020, 2023] : p._river === 'cauvery' ? [2009, 2022, 2023, 2025] : [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const vals = years.map((y) => { const v = +p['bod_' + y]; return isNaN(v) ? null : v; });
    if (vals.some((v) => v != null)) {
      html += '<div class="chart-title">BOD by year, ' + years[0] + '–' + years[years.length - 1] + '</div>' + sparkline(vals, '#dc2626', years) +
        '<p class="chart-sub">' + years.map((y, i) => y + ': ' + (vals[i] == null ? '—' : num(vals[i]))).join(' · ') + ' mg/l.' +
        (p._river === 'yamuna' ? ' No usable 2014–2020 series exists publicly.' : p._river === 'sabarmati' ? ' Three non-comparable snapshots: 2018 stretch maxima, 2020 lockdown-month samples, 2023 yearly averages — no continuous series.' : p._river === 'cauvery' ? ' Four non-comparable snapshots: 2009 CPCB values (Tamil Nadu stations only — shown in the &ldquo;Change since&rdquo; comparison; no per-year column exists for 2009), 2022 and 2023 KSPCB March samples, 2025 MPR single-month samples — no continuous series.' : '') + ' Hover a dot for that year&rsquo;s reading.</p>';
    }
  }
  html += explainerBOD();
  html += '<p class="note-box"><b>DO</b> — Dissolved Oxygen: the oxygen fish breathe. Below about 5 mg/l, fish struggle. Bathing standard: 5 mg/l or more.</p>';
  html += srcLine(p.source, p.as_of);
  openPanel(html);
}
function showCourse(p) {
  let html = '<h2>' + esc(p.drain_name) + '</h2><p class="sub">' + esc(p.town) + ' · ' + esc(p.state) + ' · drain course to the river</p>';
  html += takeaway('This drain runs ' + num(p.course_length_km) + ' km to the river, adding ' + num(p.bod_load_tpd) + ' tonnes of BOD a day — ' + (p.tapped_status === 'Tapped' ? 'intercepted' : 'untapped') + '.');
  html += '<div class="kv">' +
    '<div class="cell"><div class="k">Length</div><div class="v">' + num(p.course_length_km) + ' <small>km</small></div></div>' +
    '<div class="cell"><div class="k">Flow</div><div class="v">' + num(p.flow_mld) + ' <small>MLD</small></div></div>' +
    '<div class="cell"><div class="k">BOD load</div><div class="v">' + num(p.bod_load_tpd) + ' <small>t/day</small></div></div>' +
    '<div class="cell"><div class="k">Status</div><div class="v" style="font-size:14px">' + esc(p.tapped_status || '') + '</div></div></div>';
  if (p.course_status && /approx/i.test(p.course_status)) html += '<p class="flag">Course line is approximate — drawn from the published description, not a surveyed channel.</p>';
  html += actionBox('Intercept and tap this drain along its course, and treat the flow before it reaches the river.',
    p.town + ' municipal body + State Pollution Control Board');
  html += srcLine(p.source, p.as_of);
  openPanel(html);
}
function showIndustry(p) {
  let html = '<h2>' + esc(p.name) + '</h2><p class="sub">' + esc(p.industry_type || '') + ' · ' + esc(p.town) + ' · ' + esc(p.state) + '</p>';
  html += takeaway('Industry on the ' + esc(p.drain_name || 'river') + ' catchment. ' + (p.effluent_mld ? 'Consented/design effluent: ' + num(p.effluent_mld) + ' MLD.' : 'No effluent figure published for this unit.'));
  if (p.effluent_mld) html += '<div class="kv"><div class="cell"><div class="k">Effluent (consented/design)</div><div class="v">' + num(p.effluent_mld) + ' <small>MLD</small></div></div>' +
    '<div class="cell"><div class="k">Linked drain</div><div class="v" style="font-size:13px">' + esc(p.drain_name || 'catchment only') + '</div></div></div>';
  html += '<p class="flag">Position approximate — town/locality level. No plant-gate coordinate is published. Effluent figures are consented limits or design figures, never measurements, and are never added to a drain&rsquo;s load.</p>';
  html += actionBox('Enforce zero liquid discharge / treated-effluent standards at this unit and publish its monitoring results.',
    'State Pollution Control Board + CPCB (grossly polluting industries programme)');
  html += srcLine(p.source_name || p.source || 'CPCB grossly polluting industries lists / state board consent lists', p.as_of);
  openPanel(html);
}

/* ============================== town flyout ============================== */
function showTown(p) {
  const river = p._river;
  const t = townStats(river, p.town);
  const anchor = river === 'ganga' && ANCHOR_TOWNS.includes(p.town);
  const rr = anchor && state.religionRuling ? state.religionRuling[p.town] : null;
  let html = '<h2>' + esc(p.town) + '</h2><p class="sub">' + esc(p.state) + ' · Census 2011 town · ' + esc(p.population_basis || '') + '</p>';
  if (state.userLoc) {
    const feat = state.data[river].people.features.find((f) => f.properties.town === p.town);
    if (feat && feat.geometry) {
      const d = haversineKm(state.userLoc.lat, state.userLoc.lng, feat.geometry.coordinates[1], feat.geometry.coordinates[0]);
      html += '<p class="you-are">You are about ' + Math.round(d) + ' km from ' + esc(p.town) + '.</p>';
    }
  }
  html += '<div class="folder-tabs" role="tablist">' +
    '<button class="folder-tab active" data-ftab="treat" type="button">Treatment &amp; MLD</button>' +
    '<button class="folder-tab" data-ftab="earn" type="button">Earnings</button>' +
    '<button class="folder-tab" data-ftab="people" type="button">People</button>' +
    '<button class="folder-tab" data-ftab="rules" type="button">Who rules</button></div>';
  html += '<div class="folder-body" id="folderBody"></div>';
  openPanel(html);
  const body = $('#folderBody');
  function renderTab(which) {
    document.querySelectorAll('.folder-tab').forEach((b) => b.classList.toggle('active', b.getAttribute('data-ftab') === which));
    if (which === 'treat') body.innerHTML = townTabTreat(p, t, river);
    else if (which === 'earn') body.innerHTML = townTabEarn(p, anchor, river);
    else if (which === 'people') body.innerHTML = townTabPeople(p, anchor, rr);
    else body.innerHTML = townTabRules(p, anchor, rr);
  }
  document.querySelectorAll('.folder-tab').forEach((b) => b.addEventListener('click', () => renderTab(b.getAttribute('data-ftab'))));
  renderTab('treat');
}
function townTabTreat(p, t, river) {
  const shortfall = Math.max(0, t.untapped - t.capacity);
  const shortfallPct = (t.untapped + t.capacity) > 0 ? Math.round((shortfall / (t.untapped + t.capacity)) * 100) : 0;
  let h = '<div class="kv">' +
    '<div class="cell"><div class="k">Drains listed (CPCB 2023)</div><div class="v">' + t.drains + '</div></div>' +
    '<div class="cell"><div class="k">Untapped flow</div><div class="v">' + num(t.untapped) + ' <small>MLD</small></div></div>' +
    '<div class="cell"><div class="k">Treatment plants</div><div class="v">' + t.stps + ' <small>· ' + num(t.capacity, 0) + ' MLD capacity</small></div></div>' +
    '<div class="cell"><div class="k">Plants meeting NGT norms</div><div class="v">' + t.compliant + ' <small>of ' + t.assessed + ' assessed</small></div></div></div>';
  h += '<div class="chart-title">Untapped flow vs treatment capacity</div>';
  h += hbarRow('Untapped drains', t.untapped, Math.max(t.untapped, t.capacity, 1), '#dc2626', num(t.untapped) + ' MLD',
    'Untapped drains carry ' + num(t.untapped) + ' MLD straight into the river — no treatment at all');
  h += hbarRow('Treatment capacity', t.capacity, Math.max(t.untapped, t.capacity, 1), '#2563eb', num(t.capacity, 0) + ' MLD',
    'Treatment capacity: ' + num(t.capacity, 0) + ' MLD across ' + t.stps + ' plant' + (t.stps === 1 ? '' : 's'));
  h += '<div class="big-pct">' + shortfallPct + '%</div><div class="big-pct-label">shortfall — the share of the town&rsquo;s sewage flow with no treatment capacity behind it</div>';
  h += '<div class="chart-title">Plants vs NGT norms — one dot per plant</div><div class="dot-row">' +
    Array.from({ length: t.stps }, (_, i) => {
      const st = state.data[river].stps.features.filter((f) => f.properties.town === p.town)[i];
      const c = !st ? '#9ca3af' : st.properties.ngt_compliant === true ? '#16a34a' : st.properties.ngt_compliant === false ? '#dc2626' : '#9ca3af';
      const status = !st ? 'unknown' : st.properties.ngt_compliant === true ? 'meets NGT norms' : st.properties.ngt_compliant === false ? 'fails NGT norms' : 'not assessed';
      const tip = st ? st.properties.plant_name + ' — ' + num(st.properties.capacity_mld, 0) + ' MLD · ' + status + ' · tap to open its card' : 'Plant ' + (i + 1);
      const open = st ? ' data-open="stp|' + river + '|' + esc(st.properties.plant_name) + '|' + esc(p.town) + '"' : '';
      return '<span class="d" style="background:' + c + '" data-tip="' + esc(tip) + '"' + open + '></span>';
    }).join('') + '</div>';
  h += '<p class="chart-sub">Green = meets NGT norms · red = fails · grey = not assessed. Tap a dot to open that plant&rsquo;s card.</p>';
  if (t.stps === 0) h += '<p class="note-box">No treatment plant is listed for this town in the CPCB inventory — all of its drain flow is untreated unless a neighbouring town&rsquo;s plant serves it.</p>';
  return h;
}
function townTabEarn(p, anchor, river) {
  let lv = p.livelihoods;
  if (typeof lv === 'string' && lv.trim().startsWith('{')) { try { lv = JSON.parse(lv); } catch (e) { /* keep as plain text */ } }
  let h = '';
  if (lv && typeof lv === 'object' && lv.cultivators_pct != null) {
    h += donutSVG([
      { label: 'Cultivators', value: +lv.cultivators_pct || 0, color: '#65a30d' },
      { label: 'Farm labourers', value: +lv.agricultural_labourers_pct || 0, color: '#ca8a04' },
      { label: 'Household industry', value: +lv.household_industry_pct || 0, color: '#9333ea' },
      { label: 'Other work', value: +lv.other_workers_pct || 0, color: '#2563eb' },
    ], 120, 'workers');
    h += '<p style="margin-top:10px">' + esc(lv.plain_language || '') + '</p>';
    h += '<p class="chart-sub">' + esc(lv.basis || 'Census 2011') + '</p>';
  } else if (typeof lv === 'string' && lv.trim()) {
    h += '<p>' + esc(lv) + '</p>';
  } else if (lv && typeof lv === 'object' && lv.plain_language) {
    h += '<p>' + esc(lv.plain_language) + '</p><p class="chart-sub">' + esc(lv.basis || '') + '</p>';
  } else {
    h += '<p>How people earn a living here has not been compiled for this town.</p>';
  }
  if (!anchor && river === 'ganga') h += '<p class="note-box">Livelihood charts are compiled for the seven anchor towns; other towns show the district-level split where the Census record carries it.</p>';
  return h;
}
function townTabPeople(p, anchor, rr) {
  let h = '<div class="kv">' +
    '<div class="cell"><div class="k">Population (2011)</div><div class="v">' + num0(p.population_2011) + '</div></div>' +
    '<div class="cell"><div class="k">Literacy</div><div class="v">' + num(p.literacy_pct) + '<small>%</small></div></div>' +
    '<div class="cell"><div class="k">Sex ratio</div><div class="v">' + num0(p.sex_ratio) + ' <small>females / 1,000 males</small></div></div>' +
    '<div class="cell"><div class="k">Urban share</div><div class="v">' + num(p.urban_pct) + '<small>%</small></div></div></div>';
  if (rr && rr.religion) {
    h += '<div class="chart-title">Religion — ' + esc(rr.religion_basis) + '</div>';
    const max = Math.max.apply(null, rr.religion.map((r) => r[1]));
    rr.religion.forEach(([name, v]) => {
      h += hbarRow(name, v, max, name === 'Hindu' ? '#ea580c' : name === 'Muslim' ? '#16a34a' : '#94a3b8', v.toFixed(2) + '%',
        name + ': ' + v.toFixed(2) + '% of the district population (Census of India 2011)');
    });
    h += '<p class="chart-sub">District-level shares, Census of India 2011. The two large groups are shown prominently; small slices are grouped legibly.</p>';
  } else {
    h += '<p class="note-box">Religion shares are compiled for the seven anchor towns only — not compiled for this town.</p>';
  }
  return h;
}
function townTabRules(p, anchor, rr) {
  let h = '<p><b>Current MLA:</b> ' + esc(p.mla_name || '—') + ' · ' + esc(p.mla_party || '') +
    ' · ' + esc(p.constituency || '') + ' · elected ' + esc(p.mla_election_year || '') + '</p>';
  if (p.mla_source) h += '<p class="chart-sub">Source: ' + esc(p.mla_source) + '</p>';
  if (rr && rr.elections) {
    h += '<div class="chart-title">Who won this seat — last 20+ years</div><div class="timeline">' +
      rr.elections.map(([yr, party, name]) =>
        '<div class="tl-row"><span class="tl-year">' + yr + '</span><span class="tl-chip" style="background:' + partyColor(party) + '">' + esc(party) + ' — ' + esc(name) + '</span></div>'
      ).join('') + '</div>';
    h += '<p class="chart-sub">Assembly election winners, ' + esc(rr.constituency) + ' constituency. Sources: ECI results via constituency records (see Data tab).</p>';
    h += '<p><b>State government now:</b> ' + esc(rr.state_govt) + '</p>';
  } else {
    h += '<p class="note-box">The 20-year ruling history is compiled for the seven anchor towns only — not compiled for this town.</p>';
  }
  return h;
}

/* ============================== action list ============================== */
function findFeature(river, kind, key) {
  const d = state.data[river];
  if (!d) return null;
  if (kind === 'drain') {
    const [name, town] = key.split('|');
    return d.drains.features.find((f) => f.properties.name === name && f.properties.town === town) || null;
  }
  if (kind === 'stp') {
    const [name, town] = key.split('|');
    return d.stps.features.find((f) => f.properties.plant_name === name && f.properties.town === town) || null;
  }
  if (kind === 'town') return d.people.features.find((f) => f.properties.town === key) || null;
  if (kind === 'wq') return d.wq.features.find((f) => f.properties.station === key) || null;
  return null;
}
function flashAt(latlng) {
  const ring = L.circleMarker(latlng, { radius: 22, color: '#2563eb', weight: 3, fill: false, className: 'locate-ring', interactive: false });
  ring.addTo(map);
  setTimeout(() => { if (map.hasLayer(ring)) map.removeLayer(ring); }, 5000);
}
function openItemCard(kind, river, key) {
  const f = findFeature(river, kind, key);
  if (!f) return;
  const p = f.properties;
  if (kind === 'drain') showDrain(p);
  else if (kind === 'stp') showStp(p);
  else if (kind === 'town') showTown(p);
  else if (kind === 'wq') showWq(p);
}
function locateActionItem(it) {
  switchTab('map');
  state.activeLayer = 'all';
  applyLayers();
  const f = findFeature(it.river, it.targetKind, it.targetKey);
  let ll = null;
  if (f && f.geometry) ll = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
  if (!ll && it.town) {
    const tf = findFeature(it.river, 'town', it.town);
    if (tf && tf.geometry) ll = [tf.geometry.coordinates[1], tf.geometry.coordinates[0]];
  }
  if (ll) {
    map.flyTo(ll, 13, { duration: 1.2 });
    flashAt(ll);
  }
  if (f) openItemCard(it.targetKind, it.river, it.targetKey);
  else if (it.town) {
    const tf = findFeature(it.river, 'town', it.town);
    if (tf) showTown(tf.properties);
  }
}
function buildActionList() {
  const rivers = activeRivers();
  const items = [];
  // worst drains by measured BOD — merged across rivers, worst first
  const allDrains = [];
  rivers.forEach((river) => {
    const R = RIVERS[river], data = state.data[river];
    data.drains.features
      .filter((f) => f.properties.data_status === 'measured' && +f.properties.bod_load_tpd > 0)
      .forEach((f) => allDrains.push({ river, f }));
  });
  allDrains.sort((a, b) => (+b.f.properties.bod_load_tpd) - (+a.f.properties.bod_load_tpd)).slice(0, 12)
    .forEach(({ river, f }) => {
      const p = f.properties, R = RIVERS[river];
      items.push({ kind: 'Drain', river, town: p.town, targetKind: 'drain', targetKey: p.name + '|' + p.town,
        score: +p.bod_load_tpd,
        title: p.name + ' — ' + p.town + ', ' + p.state,
        fig: num(p.bod_load_tpd) + ' tonnes of BOD a day · ' + num(p.flow_mld) + ' MLD · ' + (p.tapped === true ? 'partially tapped' : 'untapped'),
        barValue: +p.bod_load_tpd, barMax: 260.67, barLabel: num(p.bod_load_tpd) + ' t/day BOD',
        what: 'Intercept and tap this drain into the sewer network and treat the flow before it reaches the river.',
        who: p.town + ' municipal body · ' + (R.stateAgency[p.state] || STATE_AGENCY_DEFAULT) + ' · State Pollution Control Board' });
    });
  // worst failing STPs by capacity — merged across rivers
  const allStps = [];
  rivers.forEach((river) => {
    const data = state.data[river];
    data.stps.features.filter((f) => f.properties.ngt_compliant === false)
      .forEach((f) => allStps.push({ river, f }));
  });
  allStps.sort((a, b) => (+b.f.properties.capacity_mld || 0) - (+a.f.properties.capacity_mld || 0)).slice(0, 12)
    .forEach(({ river, f }) => {
      const p = f.properties, R = RIVERS[river];
      const worst = river === 'ganga' && p.effluent_bod_mg_l ? ' · outlet BOD ' + num(p.effluent_bod_mg_l) + ' mg/l (limit 10)' : '';
      const maxCap = Math.max.apply(null, allStps.map((s) => +s.f.properties.capacity_mld || 0));
      items.push({ kind: 'Treatment plant', river, town: p.town, targetKind: 'stp', targetKey: p.plant_name + '|' + p.town,
        score: +p.capacity_mld || 0,
        title: p.plant_name + ' — ' + p.town + ', ' + p.state,
        fig: num(p.capacity_mld, 0) + ' MLD capacity · fails NGT norms' + worst,
        barValue: +p.capacity_mld || 0, barMax: maxCap || 1, barLabel: num(p.capacity_mld, 0) + ' MLD capacity',
        what: 'Bring the outlet within NGT norms — fix the failing parameter — and publish the plant\u2019s O&M spending.',
        who: (p.operator_name || 'Plant operator') + ' · ' + (R.stateAgency[p.state] || STATE_AGENCY_DEFAULT) + ' · State Pollution Control Board enforces outlet norms set by CPCB' });
    });
  // towns with the biggest untreated gap — merged across rivers
  const allTowns = [];
  rivers.forEach((river) => {
    const data = state.data[river];
    data.people.features.forEach((f) => {
      const gap = townShortfall(river, f.properties.town);
      if (gap > 0) allTowns.push({ river, town: f.properties.town, state: f.properties.state, gap });
    });
  });
  allTowns.sort((a, b) => b.gap - a.gap).slice(0, 6)
    .forEach((t) => {
      const R = RIVERS[t.river];
      const maxGap = allTowns.length ? allTowns[0].gap : 1;
      items.push({ kind: 'Town', river: t.river, town: t.town, targetKind: 'town', targetKey: t.town,
        score: t.gap,
        title: t.town + ' — ' + t.state,
        fig: num(t.gap) + ' MLD of sewage flow with no treatment capacity behind it',
        barValue: t.gap, barMax: maxGap, barLabel: num(t.gap) + ' MLD untreated gap',
        what: 'Close the treatment gap: add treatment capacity and connect households to sewers so untreated flow stops reaching the river.',
        who: t.town + ' municipal body · ' + (R.stateAgency[t.state] || STATE_AGENCY_DEFAULT) + ' · State Pollution Control Board' });
    });
  const ordered = items.slice(0, 30);
  state.actionItems = ordered;
  const scope = state.riverFilter === 'all' ? 'both rivers' : 'the ' + RIVERS[state.riverFilter].label;
  $('#actionIntro').textContent = 'The worst problems on ' + scope + ', worst first — the biggest untapped drains, the biggest failing treatment plants, and the towns with the largest untreated gap. Each one says what must happen and who is responsible. Tap any row to fly the map to it.';
  $('#actionList').innerHTML = ordered.map((it, i) => {
    const bw = it.barMax > 0 ? Math.max(2, Math.min(100, (it.barValue / it.barMax) * 100)) : 0;
    return '<li data-act="' + i + '" tabindex="0"><h3>' + esc(it.title) + '</h3>' +
      '<div class="where"><b>' + esc(riverLabel(it.river)) + '</b> · ' + esc(it.town) + ' · ' + esc(it.kind) + '</div>' +
      '<div class="fig">' + esc(it.fig) + '</div>' +
      '<div class="action-bar"><div class="hbar-track"><div class="hbar-fill" style="width:' + bw + '%;background:#dc2626" data-tip="' + esc(it.barLabel + ' — ' + it.kind + ' in ' + it.town + ', ' + riverLabel(it.river)) + '"></div></div></div>' +
      '<p class="what"><b>What must happen:</b> ' + esc(it.what) + '</p>' +
      '<p class="who"><b>Who is responsible:</b> ' + esc(it.who) + '</p>' +
      '<button class="locate-btn" type="button">⌖ Show on map</button></li>';
  }).join('');
}
$('#actionList').addEventListener('click', (e) => {
  const li = e.target.closest ? e.target.closest('li[data-act]') : null;
  if (!li || !state.actionItems) return;
  locateActionItem(state.actionItems[+li.getAttribute('data-act')]);
});
$('#actionList').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const li = e.target.closest ? e.target.closest('li[data-act]') : null;
  if (!li || !state.actionItems) return;
  locateActionItem(state.actionItems[+li.getAttribute('data-act')]);
});

/* ============================== data tab ============================== */
function renderDataTabSingle(river) {
  const data = state.data[river];
  const kpi = $('#kpiGrid'), R = RIVERS[river];
  if (river === 'ganga') {
    kpi.innerHTML =
      '<div class="kpi"><div class="n"><span data-count="609" data-dec="0">609</span></div><div class="l">drains listed by CPCB (2023)</div><div class="s">374 measured · 64 estimated · 171 never measured</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="585.17" data-dec="2">585.17</span> t/day</div><div class="l">measured BOD load into the river</div><div class="s">~96% of measured flow is untapped</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="19" data-dec="0">19</span> of 145</div><div class="l">treatment plants meet NGT norms</div><div class="s">104 fail · 22 not assessed</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="28" data-dec="0">28</span>%</div><div class="l">of sewage actually treated (national)</div><div class="s">20,235 of 72,368 MLD — CPCB 2021</div></div>' +
      '<div class="kpi"><div class="n">74–81M</div><div class="l">people in the 10 km corridor (2020)</div><div class="s">GHSL 81.2M vs WorldPop 74.2M — a range, not one number</div></div>' +
      '<div class="kpi"><div class="n">₹7,466 cr</div><div class="l">verified sanctioned build cost</div><div class="s">across 60 distinct projects · funds released/utilised: disclosed for 0 of 145 plants</div></div>';
    $('#findingsText').innerHTML =
      '<p><b>About 96% of the measured drain flow is untapped</b> — it goes straight into the river. The single biggest drain is the Slaughter House / Odean Nallah in Meerut at 260.67 tonnes of BOD a day.</p>' +
      '<p><b>Only 19 of 145 treatment plants meet NGT norms.</b> The worst value for money is Pankha (30 MLD, Kanpur): a ₹967.23 crore project whose outlet BOD is still 40.6 mg/l. At Badrinath, the outlet BOD is 1,237 mg/l — 124× the limit, essentially raw sewage.</p>' +
      '<p><b>Utilisation is bimodal:</b> 42 plants run under 50% of capacity, while 18 run over 100%. Brajghat runs at 0.4% of capacity — effectively idle. Faecal coliform is the most common failure (80 of the 104 failing plants).</p>' +
      '<p><b>46 of the 101 plants with a confirmed build party were built under a different state party than the one managing them now</b> — West Bengal 26 of 26, Uttar Pradesh 14 of 33, Bihar 6 of 6.</p>';
    $('#accountabilityText').innerHTML =
      '<p><b>Operator named</b> for 132 of 145 plants (54 of them state-pattern / HAM-scope, per-plant unconfirmed); 13 undisclosed. <b>Build cost disclosed</b> for 113 (₹7,466.16 crore verified across 60 distinct projects — each shared project counted once, never summed down the column); 32 not publicly disclosed. <b>Annual O&amp;M figure</b> for only 27 plants, all in Uttar Pradesh; 118 undisclosed. <b>Funds released vs utilised: disclosed for 0 of 145 plants.</b> Contractor named for only 5 plants; award date for 4; cost-overrun figure for 2.</p>' +
      '<p>HAM concessions cover 18 plants / 918 MLD (34.8% of capacity), all with 15-year O&amp;M. The largest operator is KMDA (29 plants / 470 MLD). Kanpur&rsquo;s six plants sit with Kanpur River Management Pvt Ltd (Shapoorji Pallonji + SSG); Prayagraj&rsquo;s nine with Prayagraj Water Pvt Ltd.</p>';
    $('#methodText').innerHTML =
      '<p><b>Drains (609):</b> extracted from the CPCB report &ldquo;Status of drains, Pre-Monsoon 2023&rdquo; (437 main stem + 172 tributaries). Measured totals match the published CPCB figures (14,097.51 MLD flow; 585.17 TPD BOD). 63 drains were unmeasured in the report; their loads were estimated by apportioning each town&rsquo;s estimated sewage (population × 185 litres per person per day × 0.8) equally across that town&rsquo;s unmeasured drains — 1,861.68 MLD / 465.42 TPD across 64 drains — and every estimated value is labelled as estimated with the method. Note: the CPCB PDF itself could not be downloaded (its host returned errors), so extraction used a search-engine full-text copy of the PDF; re-check against the original when the host recovers.</p>' +
      '<p><b>Treatment plants (145 + 6 new):</b> CPCB National Inventory of STPs (Mar 2021) plus NGRBA state reports 2022–23, joined to budgets, operators, O&amp;M and effluent measurements. All points are town centroids — no public source gives plant-site coordinates. Six plants commissioned or expanded in 2024–2026 are listed with no coordinates and are never plotted.</p>' +
      '<p><b>Water quality (115 stations):</b> Ganga Knowledge Portal (gyanganga.ai), BOD/DO/pH series 2014–2025; 112 stations current to 2025. Five stations have no coordinates and are never plotted.</p>' +
      '<p><b>Population:</b> a 10 km buffer around the river centreline, summed from GHSL GHS-POP R2023A (2020) with a WorldPop 2020 cross-check — presented as a range (74–81 million). The &gt;500 million figure sometimes quoted is the whole Ganga basin, not the corridor, and is never used as the corridor figure. Town populations are Census of India 2011.</p>';
    $('#sourceList').innerHTML =
      '<li>CPCB — Status of drains, Pre-Monsoon 2023 (drains, flows, BOD loads)</li>' +
      '<li>CPCB — National Inventory of Sewage Treatment Plants, March 2021 (plant list, capacities, utilisation)</li>' +
      '<li>NMCG / Ganga Knowledge Portal — gyanganga.ai (water-quality series 2014–2025)</li>' +
      '<li>NMCG progress reports, CPCB reports, CAG audit, Jal Nigam tables, inauguration releases (plant build years, operators, budgets)</li>' +
      '<li>Census of India 2011 (town populations, demographics, livelihoods, religion — district level)</li>' +
      '<li>Election Commission of India / MyNeta (ADR) (MLAs, election winners)</li>' +
      '<li>State pollution control boards — UP, Bihar, Jharkhand, West Bengal, Uttarakhand (consents, inspections, grossly polluting industries)</li>' +
      '<li>GHSL GHS-POP R2023A and WorldPop 2020 (corridor population — non-government, labelled as such)</li>' +
      '<li>OpenStreetMap (river centrelines) — non-government, labelled as such</li>';
    $('#gapsList').innerHTML =
      '<li><b>63 drains unmeasured</b> in the CPCB report — their loads are estimated, not measured, and labelled so.</li>' +
      '<li><b>No plant-site coordinates exist publicly</b> — all 145 plant points are town centroids; 7 plants (incl. the 6 commissioned 2024–2026) have no coordinates at all and are never plotted.</li>' +
      '<li><b>5 water-quality stations</b> have no coordinates and are never plotted.</li>' +
      '<li><b>Funds released vs utilised: disclosed for 0 of 145 plants.</b> The money trail cannot be checked from public sources.</li>' +
      '<li><b>Annual O&amp;M disclosed for only 27 plants</b> (all in Uttar Pradesh); Bihar and Jharkhand publish no O&amp;M figure at all.</li>' +
      '<li><b>No per-plant total nitrogen value</b> is published anywhere.</li>' +
      '<li><b>41 plants have no published build year</b> — their &ldquo;built under&rdquo; party cannot be established and is stated as such, never guessed.</li>' +
      '<li><b>10.6 km gap at the Farakka bifurcation</b> in the river line — left open rather than inventing a connector.</li>';
  } else if (river === 'yamuna') {
    kpi.innerHTML =
      '<div class="kpi"><div class="n"><span data-count="50" data-dec="0">50</span></div><div class="l">drains listed</div><div class="s">38 measured · 2 estimated · 10 never measured</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="358.42" data-dec="2">358.42</span> t/day</div><div class="l">measured BOD load into the river</div><div class="s">Delhi carries 271.58 of it</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="3" data-dec="0">3</span> of 115</div><div class="l">treatment plants meet NGT norms</div><div class="s">105 fail · 7 not assessed · 15 meet MoEFCC 2017</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="76" data-dec="0">76</span>%</div><div class="l">plant utilisation</div><div class="s">3,979.67 of 5,226.56 MLD actually treated</div></div>' +
      '<div class="kpi"><div class="n">34.3–36.6M</div><div class="l">people in the 10 km corridor (2020)</div><div class="s">GHSL 36.6M vs WorldPop 34.3M — a range, not one number</div></div>' +
      '<div class="kpi"><div class="n">77 of 115</div><div class="l">plants disclose no budget at all</div><div class="s">only 2 fully disclosed · 36 partially</div></div>';
    $('#findingsText').innerHTML =
      '<p><b>Delhi carries 271.58 of the 358.42 measured tonnes of BOD a day.</b> The top drain is Najafgarh + Supplementary at 111.77 TPD, then Panipat (61.84) and Shahdara (52.71).</p>' +
      '<p><b>The worst stretch is Wazirabad–Okhla:</b> dissolved oxygen was nil at ISBT, ITO, Nizamuddin and Asagarpur in September–October 2023. Only Palla and Wazirabad met bathing criteria.</p>' +
      '<p><b>Only 3 of 115 treatment plants meet NGT norms</b> (Coronation Pillar New, Nilothi Phase II, Behrampur II) under the strict all-parameters test including faecal coliform. Delhi&rsquo;s 13 common effluent treatment plants run at 34% of capacity; a CPCB 2024 inspection found 49 of 189 grossly polluting industries non-compliant.</p>';
    $('#accountabilityText').innerHTML =
      '<p><b>Budgets:</b> only 2 of 115 plants fully disclose their budget, 36 partially, 77 not at all. Where undisclosed, the card says so plainly — never guessed. <b>No party attribution</b> (who built each plant / who manages it now) has been compiled for Yamuna plants; those lines appear only on Ganga plant cards.</p>';
    $('#methodText').innerHTML =
      '<p><b>Drains (50):</b> CPCB drain data for the Yamuna. Measured and estimated totals are always shown separately and never summed: measured 4,664.41 MLD / 358.42 TPD (38 drains); estimated 164.66 MLD / 41.16 TPD (2 drains, apportioned from town population the same way as the Ganga estimates); 10 drains unmeasured.</p>' +
      '<p><b>Treatment plants (115):</b> CPCB inventory, 5,226.56 MLD designed capacity, 113 operational. Utilisation known for 110 plants (3,979.67 MLD). All points are town centroids — no public source gives plant-site coordinates. Budgets from state/NMCG publications, joined by plant ID.</p>' +
      '<p><b>Water quality (35 stations):</b> series 2021–2025 only — no usable 2014–2020 annual Yamuna series exists publicly, so earlier years are never charted. DO values are midpoints of reported min–max ranges.</p>' +
      '<p><b>Population:</b> a 10 km buffer around the Yamuna centreline (OSM relation 326077, 1,504.4 km), summed from GHSL GHS-POP R2023A (2020) with a WorldPop 2020 cross-check — presented as a range (34.3–36.6 million). Town populations are Census of India 2011; 6 towns have no verified 2011 figure.</p>';
    $('#sourceList').innerHTML =
      '<li>CPCB — drain data and STP inventory (drains, plants, capacities, utilisation)</li>' +
      '<li>CPCB 2024 inspection of grossly polluting industries (189 GPIs; 49 non-compliant)</li>' +
      '<li>Delhi Jal Board / DPCC / Haryana State Pollution Control Board (plant and drain data)</li>' +
      '<li>NMCG / Ganga Knowledge Portal (water-quality series 2021–2025)</li>' +
      '<li>Census of India 2011 (town populations, demographics, livelihoods)</li>' +
      '<li>Election Commission of India / MyNeta (ADR) (MLAs)</li>' +
      '<li>GHSL GHS-POP R2023A and WorldPop 2020 (corridor population — non-government, labelled as such)</li>' +
      '<li>OpenStreetMap (river centreline, relation 326077) — non-government, labelled as such</li>';
    $('#gapsList').innerHTML =
      '<li><b>10 drains unmeasured</b> and 2 estimated — their loads are not measured, and are labelled so.</li>' +
      '<li><b>No plant-site coordinates exist publicly</b> — all 115 plant points are town centroids.</li>' +
      '<li><b>Budgets undisclosed for 77 of 115 plants;</b> only 2 fully disclosed.</li>' +
      '<li><b>No party attribution compiled for Yamuna plants</b> — built/managed party lines are not shown, never guessed.</li>' +
      '<li><b>No 2014–2020 water-quality series</b> exists publicly; charts start in 2021.</li>' +
      '<li><b>Yamuna towns have no religion shares and no 20-year ruling history</b> compiled — the flyout says so plainly; livelihoods are qualitative only.</li>' +
      '<li><b>Only 2 drain courses</b> (Najafgarh 114.51 km, Barapulla 2.76 km) have named waterways in OSM; the other top drains are not named waterways.</li>' +
      '<li><b>Industries are aggregates/clusters only</b> — no public geocoded GPI list exists; the Delhi aggregate row (189 units) has no coordinates and is not plotted.</li>';
  } else if (river === 'sabarmati') {
    kpi.innerHTML =
      '<div class="kpi"><div class="n"><span data-count="11" data-dec="0">11</span></div><div class="l">drains listed</div><div class="s">1 measured · 8 estimated · 2 never measured</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="10.8" data-dec="1">10.8</span> t/day</div><div class="l">measured BOD load into the river</div><div class="s">one measured drain only (Danilimda); estimated 80.78 t/day kept separate</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="0" data-dec="0">0</span> of 24</div><div class="l">treatment plants shown meeting NGT norms</div><div class="s">3 fail · 21 not assessed · 9 meet MoEFCC 2017 — a data limit, not a finding</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="92.7" data-dec="1">92.7</span>%</div><div class="l">plant utilisation</div><div class="s">991.0 of 1,069.61 MLD assessed capacity actually treated</div></div>' +
      '<div class="kpi"><div class="n">9.4M</div><div class="l">people in the 10 km corridor (2020)</div><div class="s">GHSL only — WorldPop cross-check pending</div></div>' +
      '<div class="kpi"><div class="n">0 of 24</div><div class="l">plants disclose any budget figure</div><div class="s">no sanctioned cost, funds, contractor or award date published for any plant</div></div>';
    $('#findingsText').innerHTML =
      '<p><b>The Raysan–Vautha stretch is the second most polluted stretch in India</b> (CPCB 2022, Priority I) — BOD peaked at 292 mg/l in 2023. The worst station is Vasna–Narol Bridge: BOD 48.18 mg/l, dissolved oxygen 1.73 mg/l in 2023.</p>' +
      '<p><b>The biggest drain is the Old Pirana pumping station, Ahmedabad</b> — 182 MLD, an estimated 45.5 tonnes of BOD a day, untapped. All 11 drains are untapped.</p>' +
      '<p><b>Three plants fail both NGT and MoEFCC norms</b> (Pirana 180, Vasna 126, Vasna 240). Vasna 126&rsquo;s outlet BOD is 44.8 mg/l — the only per-plant effluent value published for the whole river. Nine plants meet MoEFCC 2017; none can be shown meeting NGT norms because no other outlet values are published.</p>';
    $('#accountabilityText').innerHTML =
      '<p><b>Budgets:</b> 0 of 24 plants disclose any budget figure — no sanctioned cost, funds released/utilised, contractor or award date is published for any Sabarmati plant. <b>No operator names</b> are published per plant either. <b>No party attribution</b> (who built each plant / who manages it now) has been compiled for Sabarmati plants; those lines appear only on Ganga plant cards.</p>';
    $('#methodText').innerHTML =
      '<p><b>Drains (11):</b> Gujarat Monthly Progress Reports, April 2020 (PRS action plan) and April 2021 — no CPCB drain inventory exists for the Sabarmati. One drain is measured (Danilimda storm drain, 30 MLD / 10.8 TPD, BOD 360 mg/l from a February 2023 drone survey); 8 are estimated as published flow × 250 mg/l raw-sewage BOD, the same method as the Ganga estimates; 2 are unmeasured (the Vasna Barrage outfalls, no published flow). Measured and estimated totals are always shown separately and never summed.</p>' +
      '<p><b>Treatment plants (24):</b> CPCB National Inventory of STPs, March 2021 — primary where it disagrees with the MPR — plus Gujarat MPR April 2021 Annexure-I(A). Capacity 1,324.61 MLD (Ahmedabad 1,263); utilisation known for 22 plants (991.0 MLD). All points are town centroids — no public source gives plant-site coordinates. Budgets from state/NMCG publications, joined by plant ID — every row is undisclosed.</p>' +
      '<p><b>Water quality (10 stations):</b> three snapshots, not a continuous series — 2018 stretch maxima, 2020 lockdown-month samples, 2023 yearly averages (GPCB Annual Report 2022-23). The years are never compared as if they were the same kind of measurement. No faecal coliform series, no TN/P, no real-time stations.</p>' +
      '<p><b>Population:</b> a 10 km buffer around the Sabarmati centreline (OSM relation 7717294, 383.1 km), summed from GHSL GHS-POP R2023A (2020) — 9.42 million. The WorldPop 2020 cross-check is pending. Town populations are Census of India 2011; Chiloda has no verified 2011 figure.</p>';
    $('#sourceList').innerHTML =
      '<li>Gujarat Monthly Progress Reports, April 2020 + April 2021 (drains, STPs, action plan)</li>' +
      '<li>CPCB — National Inventory of Sewage Treatment Plants, March 2021 (plant list, capacities)</li>' +
      '<li>GPCB Annual Report 2022-23 (2023 water-quality averages)</li>' +
      '<li>CPCB — polluted river stretches, 2022 (Raysan–Vautha, Priority I)</li>' +
      '<li>World Bank ESIA for the new 375 MLD Vasna STP (Vasna 126 outlet BOD 44.8 mg/l)</li>' +
      '<li>NMCG CMC minutes, January 2023; Gujarat High Court suo motu PIL C/WPPIL/98/2021 (2024)</li>' +
      '<li>Census of India 2011 (town populations, demographics)</li>' +
      '<li>Election Commission of India / MyNeta (ADR) (MLAs)</li>' +
      '<li>GHSL GHS-POP R2023A 2020 (corridor population — non-government, labelled as such); WorldPop cross-check pending</li>' +
      '<li>OpenStreetMap (river centreline, relation 7717294) — non-government, labelled as such</li>';
    $('#gapsList').innerHTML =
      '<li><b>No per-drain BOD is published for any Sabarmati drain</b> — 8 of 11 loads are estimated, 2 unmeasured, and all are labelled so.</li>' +
      '<li><b>No per-plant effluent values</b> except Vasna 126 — hence 0 plants shown meeting NGT norms, a data limit, not a finding. The March 2021 MPR compliance flag is contradicted by 2024 High Court / GPCB findings that 9 of 14 Ahmedabad STPs were not meeting standards.</li>' +
      '<li><b>Budgets undisclosed for all 24 plants;</b> no operator names published per plant.</li>' +
      '<li><b>No party attribution compiled for Sabarmati plants</b> — built/managed party lines are not shown, never guessed.</li>' +
      '<li><b>Water quality is three non-comparable snapshots</b> (2018 / 2020 / 2023); no faecal coliform series, no TN/P, no real-time stations.</li>' +
      '<li><b>No drain courses;</b> tributary (Khari / Meshwo) drains missing; no Rajasthan STPs.</li>' +
      '<li><b>Sabarmati towns have no religion shares, no 20-year ruling history and no livelihood splits</b> compiled — the flyout says so plainly.</li>' +
      '<li><b>All points are town centroids</b> — no public source gives plant-site or drain-site coordinates. River length is 383.1 km on the OSM centreline vs 371 km published (Government of Gujarat) — the OSM line runs longer, likely the estuary meander.</li>';
  } else {
    kpi.innerHTML =
      '<div class="kpi"><div class="n"><span data-count="14" data-dec="0">14</span></div><div class="l">drains listed</div><div class="s">0 measured · 12 estimated · 2 never measured</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="66.75" data-dec="2">66.75</span> t/day</div><div class="l">estimated BOD load into the river</div><div class="s">0 measured — every drain is estimated or unmeasured; biggest is Vrishabhavathi (Bengaluru), 53.75 TPD, a 2017 estimate</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="0" data-dec="0">0</span> of 68</div><div class="l">treatment plants shown meeting NGT norms</div><div class="s">65 meet MoEFCC 2017 · 3 unassessed · no per-plant effluent value published — a data limit, not a finding</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="69.7" data-dec="1">69.7</span>%</div><div class="l">plant utilisation</div><div class="s">907.87 of 1,303.19 MLD assessed capacity actually treated</div></div>' +
      '<div class="kpi"><div class="n">9.0M</div><div class="l">people in the 10 km corridor (2020)</div><div class="s">GHSL only — WorldPop cross-check pending</div></div>' +
      '<div class="kpi"><div class="n">0 of 68</div><div class="l">plants disclose any budget figure</div><div class="s">no sanctioned cost, funds, contractor or award date published for any plant</div></div>';
    $('#findingsText').innerHTML =
      '<p><b>No Cauvery drain has ever been measured.</b> The 66.75 tonnes-a-day figure is an estimate, and 53.75 of it — four-fifths — is a single 2017 estimate for the Vrishabhavathi valley outflow from Bengaluru; treatment capacity there has since risen to 390 MLD, so the figure is very likely overstated today. All 14 drains are untapped.</p>' +
      '<p><b>The worst stretch is Mettur to Mayiladuthurai (200 km), Priority II</b> — BOD peaked at 24 mg/l (CPCB, October 2025 revision). The worst station with a published value is Erode near Chirapalayam: BOD 17.0 mg/l, dissolved oxygen 1.5 mg/l — but that reading is from 2009, the most recent per-station value for the whole Tamil Nadu reach.</p>' +
      '<p><b>65 of 68 plants meet the MoEFCC 2017 consent standard, but not one can be shown meeting NGT norms</b> — no per-plant effluent BOD is published for any Cauvery plant, so NGT compliance cannot be assessed at all. Utilisation is 69.7% of assessed capacity.</p>';
    $('#accountabilityText').innerHTML =
      '<p><b>Budgets:</b> 0 of 68 plants disclose any budget figure — no sanctioned cost, funds released/utilised, contractor or award date is published for any Cauvery plant. <b>No party attribution</b> (who built each plant / who manages it now) has been compiled for Cauvery plants; those lines appear only on Ganga plant cards.</p>' +
      '<p><b>Operators:</b> no operator is named per plant in the Tamil Nadu MPR; Karnataka plants list only the implementing agency — BWSSB in Bengaluru, KUWS&amp;DB / concerned ULB elsewhere.</p>';
    $('#methodText').innerHTML =
      '<p><b>Drains (14):</b> Karnataka and Tamil Nadu Monthly Progress Reports — no CPCB drain inventory exists for the Cauvery, and no drain has a published measured flow with a measured BOD. 12 are estimated as published untreated flow × 250 mg/l raw-sewage BOD, the same method as the Ganga estimates; 2 are unmeasured (Srirangapatna, T Narasipura — no flow published). Measured and estimated totals are always shown separately and never summed.</p>' +
      '<p><b>Treatment plants (68):</b> Karnataka MPR November 2025 Annexure-1 and Tamil Nadu MPR August 2026, cross-checked against the CPCB National Inventory of STPs, March 2021. Capacity 1,464.19 MLD (Karnataka 830.19, Tamil Nadu 634.00); utilisation known for 65 plants (907.87 MLD). Compliance is mapped from the MPRs&rsquo; single &ldquo;Complied&rdquo; flag, which means the plant meets the consent standard (BOD 20 mg/l, MoEFCC 2017) — NGT compliance (BOD 10 mg/l) cannot be inferred from it and is left unassessed. All points are town centroids — no public source gives plant-site coordinates.</p>' +
      '<p><b>Water quality (22 stations):</b> four snapshots, not a continuous series — 2009 CPCB annual-summary values (Tamil Nadu stations only), 2022 and 2023 KSPCB March monthly samples, 2025 single-month samples from the Karnataka MPR. The years are never compared as if they were the same kind of measurement. The 2009 values sit in the earliest/latest readings only — the per-year columns start at 2014, so no 2009 column exists. No pH values are published for any Cauvery station.</p>' +
      '<p><b>Population:</b> a 10 km buffer around the Cauvery centreline (OSM relation 2704746, 807.07 km), summed from GHSL GHS-POP R2023A (2020) — 9.02 million. The WorldPop 2020 cross-check is pending. Town populations are Census of India 2011; Poompuhar has no verified 2011 figure.</p>';
    $('#sourceList').innerHTML =
      '<li>Karnataka Monthly Progress Reports, January 2025 + November 2025 (drains, STPs, water quality)</li>' +
      '<li>Tamil Nadu Monthly Progress Reports, February 2021 + August 2026 (drains, STPs, water quality)</li>' +
      '<li>CPCB — National Inventory of Sewage Treatment Plants, March 2021 (plant list, capacities)</li>' +
      '<li>CPCB — polluted river stretches, 2022 + October 2025 revision (Mettur–Mayiladuthurai, Priority II; Ranganathittu–Satyagala, Priority IV)</li>' +
      '<li>KSPCB — Water Quality of Polluted River Stretches, March 2022 + March 2023 (station values)</li>' +
      '<li>IISc / CSIR-NEERI — Vrishabhavathi valley sewage estimate, 2017 (Bengaluru untreated flow)</li>' +
      '<li>Census of India 2011 (town populations); Election Commission of India / MyNeta (ADR) (MLAs — Karnataka 2023, Tamil Nadu 2026)</li>' +
      '<li>GHSL GHS-POP R2023A 2020 (corridor population — non-government, labelled as such); WorldPop cross-check pending</li>' +
      '<li>OpenStreetMap (river centreline, relation 2704746) — non-government, labelled as such</li>';
    $('#gapsList').innerHTML =
      '<li><b>No measured drains</b> — not one Cauvery drain has a published measured flow with a measured BOD; the 66.75 TPD total is an estimate dominated by one 2017 Bengaluru figure.</li>' +
      '<li><b>No per-plant effluent values</b> — NGT compliance cannot be assessed for any of the 68 plants; the 0-meets-NGT figure must never be quoted as a finding.</li>' +
      '<li><b>Budgets undisclosed for all 68 plants;</b> no operator named per plant in Tamil Nadu.</li>' +
      '<li><b>Tamil Nadu water quality is 2009-only</b> — the most recent per-station values for the entire Tamil Nadu reach are 17 years old; the August 2026 MPR gives only a range (BOD 2.0–4.7 mg/l across 19 stations).</li>' +
      '<li><b>No drain data for most towns</b> — Mysuru, Mandya, Trichy, Karur, Mettur, Thanjavur, Kumbakonam, Mayiladuthurai and others have no drain rows: no published drain flow or count, not zero drains.</li>' +
      '<li><b>No drain courses</b> — no drain alignment is published for any drain.</li>' +
      '<li><b>WorldPop cross-check pending.</b></li>' +
      '<li><b>Cauvery towns have no religion shares, no 20-year ruling history and no livelihood splits</b> compiled — the flyout says so plainly.</li>' +
      '<li><b>All points are town centroids</b> — no public source gives plant-site or drain-site coordinates. River length is 807.07 km on the OSM centreline; a ~2.1 km anabranch near Mysuru is excluded from the centreline.</li>';
  }
  const dl = $('#downloadList');
  const files = river === 'ganga'
    ? [['drains.geojson', 'Drains — 609 records'], ['drains.csv', 'Drains — CSV'], ['stp_accountability.geojson', 'Treatment plants with accountability — 151 records'], ['stp_accountability.csv', 'Treatment plants with accountability — CSV'], ['water_quality.geojson', 'Water-quality stations — 115 records'], ['people.geojson', 'Towns — 494 records (Census 2011 + MLAs)'], ['drain_courses.geojson', 'Drain courses — 20 lines'], ['industries.geojson', 'Industries — 25 records'], ['standards_comparison.csv', 'Standards comparison — India vs EU/US/WHO'], ['population.json', 'Corridor population method + totals']]
    : river === 'yamuna'
    ? [['drains.geojson', 'Drains — 50 records'], ['drains.csv', 'Drains — CSV'], ['stps.geojson', 'Treatment plants — 115 records'], ['stps.csv', 'Treatment plants — CSV'], ['stp_budgets.csv', 'Plant budgets — 115 rows'], ['water_quality.geojson', 'Water-quality stations — 35 records'], ['people.geojson', 'Towns — 45 records (Census 2011 + MLAs)'], ['drain_courses.geojson', 'Drain courses — 2 lines'], ['industries.geojson', 'Industries — 4 plotted clusters'], ['population.json', 'Corridor population method + totals']]
    : river === 'sabarmati'
    ? [['drains.geojson', 'Drains — 11 records'], ['drains.csv', 'Drains — CSV'], ['stps.geojson', 'Treatment plants — 24 records'], ['stps.csv', 'Treatment plants — CSV'], ['stp_budgets.csv', 'Plant budgets — 24 rows'], ['water_quality.geojson', 'Water-quality stations — 10 records'], ['people.geojson', 'Towns — 12 records (Census 2011 + MLAs)'], ['drain_courses.geojson', 'Drain courses — 0 lines'], ['industries.geojson', 'Industries — 1 aggregate row'], ['population.json', 'Corridor population method + totals']]
    : [['drains.geojson', 'Drains — 14 records'], ['drains.csv', 'Drains — CSV'], ['stps.geojson', 'Treatment plants — 68 records'], ['stps.csv', 'Treatment plants — CSV'], ['stp_budgets.csv', 'Plant budgets — 68 rows'], ['water_quality.geojson', 'Water-quality stations — 22 records'], ['people.geojson', 'Towns — 41 records (Census 2011 + MLAs)'], ['drain_courses.geojson', 'Drain courses — 0 lines'], ['industries.geojson', 'Industries — 8 aggregate rows'], ['population.json', 'Corridor population method + totals']];
  dl.innerHTML = files.map(([f, label]) => '<li><a href="data/' + river + '/' + f + '" download>' + esc(label) + '</a> <span style="color:var(--muted)">(' + f + ')</span></li>').join('');
}
function renderDataTab() {
  if (state.riverFilter !== 'all') {
    renderDataTabSingle(state.riverFilter);
  } else {
    // combined view: render each river's sections, capture them, compose with headings
    const grab = {};
    ['kpiGrid', 'findingsText', 'accountabilityText', 'methodText', 'sourceList', 'gapsList', 'downloadList'].forEach((id) => { grab[id] = {}; });
    ['ganga', 'yamuna', 'sabarmati', 'cauvery'].forEach((river) => {
      renderDataTabSingle(river);
      Object.keys(grab).forEach((id) => { grab[id][river] = document.getElementById(id).innerHTML; });
    });
    $('#kpiGrid').innerHTML =
      '<div class="kpi"><div class="n"><span data-count="684" data-dec="0">684</span></div><div class="l">drains listed by CPCB</div><div class="s">609 Ganga + 50 Yamuna + 11 Sabarmati + 14 Cauvery · 413 measured · 86 estimated · 185 never measured</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="954.39" data-dec="2">954.39</span> t/day</div><div class="l">measured BOD load into the rivers</div><div class="s">585.17 Ganga + 358.42 Yamuna + 10.8 Sabarmati · Cauvery: no measured drain</div></div>' +
      '<div class="kpi"><div class="n"><span data-count="22" data-dec="0">22</span> of 352</div><div class="l">treatment plants meet NGT norms</div><div class="s">19 Ganga + 3 Yamuna + 0 Sabarmati + 0 Cauvery · 212 fail · 118 not assessed</div></div>' +
      '<div class="kpi"><div class="n">127–136M</div><div class="l">people in the 10 km corridors (2020)</div><div class="s">Ganga 74–81M + Yamuna 34.3–36.6M + Sabarmati 9.4M + Cauvery 9.0M (GHSL only for both — WorldPop cross-check pending) — ranges, not one number</div></div>' +
      '<div class="kpi"><div class="n">₹7,466 cr</div><div class="l">verified sanctioned build cost — Ganga</div><div class="s">across 60 distinct projects · funds released/utilised disclosed for 0 of 145 plants</div></div>' +
      '<div class="kpi"><div class="n">77 of 115</div><div class="l">Yamuna plants disclose no budget at all</div><div class="s">only 2 fully disclosed · 36 partially</div></div>';
    $('#findingsText').innerHTML = '<h4>Ganga</h4>' + grab.findingsText.ganga + '<h4>Yamuna</h4>' + grab.findingsText.yamuna + '<h4>Sabarmati</h4>' + grab.findingsText.sabarmati + '<h4>Cauvery</h4>' + grab.findingsText.cauvery;
    $('#accountabilityText').innerHTML = '<h4>Ganga</h4>' + grab.accountabilityText.ganga + '<h4>Yamuna</h4>' + grab.accountabilityText.yamuna + '<h4>Sabarmati</h4>' + grab.accountabilityText.sabarmati + '<h4>Cauvery</h4>' + grab.accountabilityText.cauvery;
    $('#methodText').innerHTML = '<h4>Ganga</h4>' + grab.methodText.ganga + '<h4>Yamuna</h4>' + grab.methodText.yamuna + '<h4>Sabarmati</h4>' + grab.methodText.sabarmati + '<h4>Cauvery</h4>' + grab.methodText.cauvery;
    $('#sourceList').innerHTML = '<li><b>Ganga</b></li>' + grab.sourceList.ganga + '<li><b>Yamuna</b></li>' + grab.sourceList.yamuna + '<li><b>Sabarmati</b></li>' + grab.sourceList.sabarmati + '<li><b>Cauvery</b></li>' + grab.sourceList.cauvery;
    $('#gapsList').innerHTML = '<li><b>Ganga</b></li>' + grab.gapsList.ganga + '<li><b>Yamuna</b></li>' + grab.gapsList.yamuna + '<li><b>Sabarmati</b></li>' + grab.gapsList.sabarmati + '<li><b>Cauvery</b></li>' + grab.gapsList.cauvery;
    $('#downloadList').innerHTML = '<li><b>Ganga</b></li>' + grab.downloadList.ganga + '<li><b>Yamuna</b></li>' + grab.downloadList.yamuna + '<li><b>Sabarmati</b></li>' + grab.downloadList.sabarmati + '<li><b>Cauvery</b></li>' + grab.downloadList.cauvery;
  }
  // every KPI gets a hover tooltip with its full figure and source line
  document.querySelectorAll('#kpiGrid .kpi').forEach((el) => {
    const l = el.querySelector('.l'), s = el.querySelector('.s'), n = el.querySelector('.n');
    if (l) el.setAttribute('data-tip', (n ? n.textContent.trim() + ' — ' : '') + l.textContent.trim() + (s ? ' · ' + s.textContent.trim() : ''));
  });
  animateCountUps($('#dataView'));
}
/* Standards chart data — transcribed from data/ganga/standards_comparison.csv
   and standards_NOTES.md (23 Nov 2026). No value invented: "No limit" means
   the regime sets no cap for that parameter in the instrument compared.
   NGT figures are the metro tier of a tiered table (Class I: BOD 20), not a
   notified uniform rule. NH4-N 5 is NOT charted: it is a 2015 draft/programme
   target, not an operative limit — the operative nutrient limit is TN 10. */
const STD_REGIMES = [
  { key: 'ngt', name: 'India — NGT 2019 (metro)', tag: 'metro tier', color: '#1f4e79' },
  { key: 'moefcc', name: 'India — MoEFCC 2017', tag: 'notified rule', color: '#94a3b8' },
  { key: 'eu91', name: 'EU 1991', tag: '91/271/EEC', color: '#2563eb' },
  { key: 'eu24', name: 'EU recast 2024', tag: '(EU) 2024/3019', color: '#0ea5e9' },
  { key: 'us', name: 'US EPA', tag: '40 CFR 133', color: '#65a30d' },
  { key: 'who', name: 'WHO 2006', tag: 'reuse guidance', color: '#b45309' },
];
const STD_CHART = {
  'BOD': { unit: 'mg/l', values: {
    ngt: { v: 10, note: 'Metro tier of the tiered table. Class I towns: 20. Not a notified uniform rule.' },
    moefcc: { v: 20, note: 'Metro cities and state capitals: 20; elsewhere 30. The binding notified rule.' },
    eu91: { v: 25, note: '25 mg/l with 70–90% removal.' },
    eu24: { v: 25, note: 'Unchanged from 1991.' },
    us: { v: 30, note: '30-day average 30; 7-day 45; ≥85% removal.' },
    who: { v: null, note: 'No discharge limit — WHO regulates reuse risk, not river discharge.' } } },
  'COD': { unit: 'mg/l', values: {
    ngt: { v: 50, note: 'Strictest COD limit in the comparison.' },
    moefcc: { v: null, note: 'No COD limit at all — the largest single gap between the two Indian instruments.' },
    eu91: { v: 125, note: '125 mg/l with 75% reduction.' },
    eu24: { v: 125, note: 'Unchanged; TOC 37 mg/l as an alternative measurand.' },
    us: { v: null, note: 'No COD limit in 40 CFR 133.' },
    who: { v: null, note: 'No discharge limit.' } } },
  'TSS': { unit: 'mg/l', values: {
    ngt: { v: 20, note: 'Metro tier. Class I: 30; other tiers 50.' },
    moefcc: { v: 50, note: 'Metro: 50; elsewhere 100 — the loosest value in the whole comparison.' },
    eu91: { v: 35, note: '35 mg/l with 90% reduction.' },
    eu24: { v: 35, note: 'Unchanged; requirement optional per Annex I Note 3.' },
    us: { v: 30, note: '30-day average 30; 7-day 45; ≥85% removal.' },
    who: { v: null, note: 'No discharge limit.' } } },
  'Total nitrogen': { unit: 'mg/l', values: {
    ngt: { v: 10, note: 'Metro tier. Class I: 15; other tiers no TN limit. The operative nutrient limit.' },
    moefcc: { v: null, note: 'No TN limit.' },
    eu91: { v: 15, note: '15 mg/l (10,000–100,000 p.e.); 10 above 100,000 p.e. — sensitive areas only.' },
    eu24: { v: 10, note: '10 mg/l (10,000–150,000 p.e.); 8 mg/l above 150,000 p.e. — now stricter than India for large plants.' },
    us: { v: null, note: 'No federal TN limit — nutrients only via permit-specific water-quality limits.' },
    who: { v: null, note: 'No discharge limit — nutrients treated as an irrigation resource.' } } },
  'Total phosphorus': { unit: 'mg/l', values: {
    ngt: { v: 1.0, note: 'Metro tier, qualified "(for discharge into ponds, lakes)".' },
    moefcc: { v: null, note: 'No TP limit.' },
    eu91: { v: 2, note: '2 mg/l (10,000–100,000 p.e.); 1 above 100,000 p.e. — sensitive areas only.' },
    eu24: { v: 0.7, note: '0.7 mg/l (10,000–150,000 p.e.); 0.5 above 150,000 p.e. — now 2× stricter than India.' },
    us: { v: null, note: 'No federal TP limit.' },
    who: { v: null, note: 'No discharge limit.' } } },
  'Faecal coliform': { unit: 'MPN/100 ml', values: {
    ngt: { v: 100, note: 'Desirable 100; permissible 230 MPN/100 ml — the strictest pathogen number in the comparison.' },
    moefcc: { v: 1000, note: 'Less than 1,000 MPN/100 ml anywhere in the country.' },
    eu91: { v: null, note: 'No pathogen limit in the UWWTD itself.' },
    eu24: { v: null, note: 'No pathogen limit in the UWWTD itself.' },
    us: { v: null, note: 'No limit in Part 133. Ambient E. coli GM 126 is a different metric — not comparable.' },
    who: { v: null, note: 'No faecal-coliform discharge limit; reuse guidance E. coli ≤1,000/100 ml.' } } },
  'pH': { unit: 'pH units', ranges: {
    ngt: { lo: 5.5, hi: 9.0, note: 'Widest range — the most permissive lower bound of any regime that sets one.' },
    moefcc: { lo: 6.5, hi: 9.0, note: '6.5–9.0 anywhere in the country.' },
    eu91: { lo: null, note: 'No pH limit in the UWWTD.' },
    eu24: { lo: null, note: 'No pH limit in the recast.' },
    us: { lo: 6.0, hi: 9.0, note: '6.0–9.0.' },
    who: { lo: null, note: 'No pH limit.' } } },
};
function renderStdChart(param) {
  const P = STD_CHART[param];
  const chart = $('#stdChart');
  const isRange = !!P.ranges;
  const max = isRange ? 14 : Math.max.apply(null, STD_REGIMES.map((r) => (P.values[r.key].v == null ? 0 : P.values[r.key].v)));
  chart.innerHTML = '<div class="chart-title">' + esc(param) + ' — discharge limits (' + esc(P.unit) + ') · ' +
    (isRange ? 'allowed range — wider = more permissive' : 'lower is stricter') + '</div>' +
    STD_REGIMES.map((reg) => {
      const entry = isRange ? P.ranges[reg.key] : P.values[reg.key];
      const hasVal = isRange ? entry.lo != null : entry.v != null;
      const valText = !hasVal ? '—' : isRange ? entry.lo + '–' + entry.hi : num(entry.v) + ' ' + P.unit;
      const tip = reg.name + ': ' + (hasVal ? valText : 'no limit set') + ' — ' + entry.note;
      if (!hasVal) {
        return '<div class="std-row"><div class="std-regime">' + esc(reg.name) + '<span class="tag">' + esc(reg.tag) + '</span></div>' +
          '<div class="std-track" style="background:transparent"><span class="std-nolimit" data-tip="' + esc(tip) + '">No limit set</span></div>' +
          '<div class="std-val std-nolimit">—</div></div>';
      }
      const left = isRange ? (entry.lo / 14 * 100) : 0;
      const width = isRange ? ((entry.hi - entry.lo) / 14 * 100) : (entry.v / max * 100);
      return '<div class="std-row"><div class="std-regime">' + esc(reg.name) + '<span class="tag">' + esc(reg.tag) + '</span></div>' +
        '<div class="std-track"><div class="std-fill" style="width:0;left:' + left.toFixed(1) + '%;background:' + reg.color + '" data-w="' + width.toFixed(1) + '" data-l="' + left.toFixed(1) + '" data-tip="' + esc(tip) + '"></div></div>' +
        '<div class="std-val">' + esc(valText) + '</div></div>';
    }).join('');
  // animate bars from zero width (smooth transition on parameter switch)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    chart.querySelectorAll('.std-fill').forEach((el) => {
      el.style.width = el.getAttribute('data-w') + '%';
      el.style.left = el.getAttribute('data-l') + '%';
    });
  }));
}
async function renderStandards() {
  if (!state.standards) {
    try {
      const rows = parseCSV(await fetchText('data/ganga/standards_comparison.csv'));
      state.standards = rows;
      const cols = [['parameter', 'Parameter'], ['india_ngt_2019', 'India — NGT 2019'], ['india_moefcc_2017', 'India — MoEFCC 2017'],
        ['eu_uwwtd_1991', 'EU 1991'], ['eu_recas_2024', 'EU recast 2024'], ['us_epa_secondary', 'US EPA'], ['who_2006', 'WHO 2006']];
      $('#stdTable').innerHTML = '<thead><tr>' + cols.map(([k, l]) => '<th>' + l + '</th>').join('') + '</tr></thead><tbody>' +
        rows.map((r) => '<tr>' + cols.map(([k]) => '<td>' + esc(r[k] || '—') + '</td>').join('') + '</tr>').join('') + '</tbody>';
    } catch (e) {
      $('#stdTable').innerHTML = '<tbody><tr><td>Standards table could not be loaded. <a href="data/ganga/standards_comparison.csv" download>Download the CSV</a>.</td></tr></tbody>';
    }
  }
  const params = Object.keys(STD_CHART);
  $('#stdParams').innerHTML = params.map((p) => '<button class="std-param-btn' + (p === state.stdParam ? ' active' : '') + '" data-param="' + esc(p) + '" type="button">' + esc(p) + '</button>').join('');
  $('#stdParams').querySelectorAll('.std-param-btn').forEach((b) => b.addEventListener('click', () => {
    state.stdParam = b.getAttribute('data-param');
    document.querySelectorAll('.std-param-btn').forEach((x) => x.classList.toggle('active', x === b));
    renderStdChart(state.stdParam);
  }));
  renderStdChart(state.stdParam);
}

/* ============================== search / tabs / river filter ============================== */
/* ---- town search: type a town name, pick a suggestion or press Enter ----
   (the old datalist + exact "Town · River" lookup silently did nothing when
   a user typed just "Kanpur" and hit Enter) */
function flyToTown(entry) {
  const data = state.data[entry.river];
  const feat = data.people.features.find((f) => f.properties.town === entry.props.town);
  if (feat && feat.geometry) map.flyTo([feat.geometry.coordinates[1], feat.geometry.coordinates[0]], 11, { duration: 1.2 });
  showTown(entry.props);
}
function searchTowns(q) {
  q = (q || '').trim().toLowerCase();
  if (!q) return [];
  const out = [];
  Object.keys(state.townIndex).forEach((key) => {
    const town = key.split(' · ')[0];
    const entry = state.townIndex[key];
    if (town.toLowerCase().indexOf(q) === -1) return;
    out.push({ town, river: entry.river, props: entry.props,
      starts: town.toLowerCase().indexOf(q) === 0, pop: entry.props.population_2011 || 0 });
  });
  out.sort((a, b) => (a.starts === b.starts ? b.pop - a.pop : a.starts ? -1 : 1));
  return out.slice(0, 8);
}
function hideSuggest() { $('#townSuggest').hidden = true; }
function renderSuggest(matches) {
  const box = $('#townSuggest');
  if (!matches.length) { box.hidden = true; box.innerHTML = ''; return; }
  box.innerHTML = matches.map((m, i) => '<button type="button" class="town-suggest-item" data-i="' + i + '"><b>' + esc(m.town) + '</b> · ' + esc(riverLabel(m.river)) + '<span>' + esc(m.props.state || '') + (m.pop ? ' · pop. ' + num0(m.pop) : '') + '</span></button>').join('');
  box.hidden = false;
  box.querySelectorAll('.town-suggest-item').forEach((b) => b.addEventListener('click', () => {
    const m = matches[+b.getAttribute('data-i')];
    hideSuggest();
    $('#townSearch').value = m.town + ' · ' + riverLabel(m.river);
    flyToTown(m);
  }));
}
$('#townSearch').addEventListener('input', () => {
  renderSuggest(searchTowns($('#townSearch').value));
});
$('#townSearch').addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { hideSuggest(); return; }
  if (e.key !== 'Enter') return;
  const q = $('#townSearch').value.trim();
  if (!q) return;
  const matches = searchTowns(q);
  if (!matches.length) {
    const box = $('#townSuggest');
    box.innerHTML = '<div class="town-suggest-empty">No town found for “' + esc(q) + '”. Try another spelling.</div>';
    box.hidden = false;
    return;
  }
  // exact town name first — Prayagraj sits on both rivers, so show both
  // entries and let the user pick rather than guessing
  const exact = matches.filter((m) => m.town.toLowerCase() === q.toLowerCase());
  if (exact.length === 1) { hideSuggest(); flyToTown(exact[0]); return; }
  if (exact.length > 1) { renderSuggest(exact); return; }
  hideSuggest();
  flyToTown(matches[0]);
});
$('#townSearch').addEventListener('blur', () => { setTimeout(hideSuggest, 150); });

/* ---- "Near me": use the browser location to find the nearest mapped town ---- */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371, dLa = (lat2 - lat1) * Math.PI / 180, dLo = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
  return 2 * R * Math.asin(Math.sqrt(a));
}
function nearestTown(lat, lng) {
  let best = null;
  activeRivers().forEach((river) => {
    state.data[river].people.features.forEach((f) => {
      if (!f.geometry) return;
      const d = haversineKm(lat, lng, f.geometry.coordinates[1], f.geometry.coordinates[0]);
      if (!best || d < best.dist) best = { river, props: f.properties, dist: d };
    });
  });
  return best;
}
function showLocateStatus(msg) {
  const el = $('#locateStatus');
  el.textContent = msg;
  el.hidden = false;
}
$('#locateMe').addEventListener('click', () => {
  if (!navigator.geolocation) { showLocateStatus('Your browser does not share location — search for your town above instead.'); return; }
  showLocateStatus('Finding your location…');
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude, lng = pos.coords.longitude;
    state.userLoc = { lat, lng };
    const best = nearestTown(lat, lng);
    if (!best) { showLocateStatus('No mapped towns loaded yet — search for your town above instead.'); return; }
    const km = Math.round(best.dist);
    showLocateStatus(km > 500
      ? 'You are far from these rivers — the nearest mapped town is ' + best.props.town + ' (' + riverLabel(best.river) + '), about ' + num0(km) + ' km away.'
      : 'Nearest mapped town: ' + best.props.town + ' (' + riverLabel(best.river) + ') — about ' + km + ' km away.');
    flyToTown({ river: best.river, props: best.props });
  }, (err) => {
    showLocateStatus(err.code === 1
      ? 'Location access blocked — search for your town above instead.'
      : 'Could not get your location — search for your town above instead.');
  }, { timeout: 10000, maximumAge: 60000 });
});
$('#wholeRiver').addEventListener('click', () => fitScope());
function switchTab(name) {
  ['map', 'action', 'data'].forEach((t) => {
    $('#tab' + t[0].toUpperCase() + t.slice(1)).classList.toggle('active', t === name);
    $('#' + t + 'View').hidden = t !== name;
  });
  if (name === 'map') setTimeout(() => map.invalidateSize(), 50);
  if (name === 'data') renderStandards();
}
$('#tabMap').addEventListener('click', () => switchTab('map'));
$('#tabAction').addEventListener('click', () => switchTab('action'));
$('#tabData').addEventListener('click', () => switchTab('data'));
$('#shortcomingsOnly').addEventListener('change', (e) => {
  state.shortcomingsOnly = e.target.checked;
  buildLayers();
});
function updateHeaderCounts() {
  const rivers = activeRivers();
  let drains = 0, stps = 0, stpsTotal = 0, wq = 0, wqTotal = 0, towns = 0, courses = 0, ind = 0, newNote = '';
  rivers.forEach((river) => {
    const data = state.data[river];
    drains += plottedCount(data.drains);
    stps += plottedCount(data.stps);
    stpsTotal += river === 'ganga' ? 145 : data.stps.features.length;
    wq += plottedCount(data.wq);
    wqTotal += data.wq.features.length;
    towns += plottedCount(data.people);
    courses += data.courses.features.length;
    ind += data.industries.features.length;
    if (river === 'ganga') newNote = ' (+6 new, no location)';
  });
  const line = drains + ' drains · ' + stps + ' of ' + stpsTotal + ' plants' + newNote + ' · ' +
    wq + ' of ' + wqTotal + ' stations · ' + towns + ' towns · ' +
    courses + ' drain courses · ' + ind + ' industries';
  $('#headerCounts').textContent = line + ' — records with a published location, placed on the map';
}
async function setRiverFilter(filter) {
  state.riverFilter = filter;
  const sel = $('#riverFilter');
  if (sel) sel.value = filter;
  $('#detailPanel').hidden = true;
  $('#mapLoading').hidden = false;
  $('#mapLoading').textContent = 'Loading ' + (filter === 'all' ? 'all rivers' : RIVERS[filter].label) + ' data…';
  try {
    await Promise.all(activeRivers().map((r) => loadRiverData(r)));
  } catch (e) {
    $('#mapLoading').textContent = 'Could not load river data (' + e.message + '). Check the data/ folder is served with the page.';
    return;
  }
  $('#mapLoading').hidden = true;
  applyRiverScope();
}
function applyRiverScope() {
  buildLayers();
  updateHeaderCounts();
  renderDataTab();
  buildActionList();
  fitScope();
}
function fitScope() {
  const bounds = L.latLngBounds();
  activeRivers().forEach((river) => {
    state.data[river].drains.features.forEach((f) => bounds.extend([f.geometry.coordinates[1], f.geometry.coordinates[0]]));
  });
  if (bounds.isValid()) map.fitBounds(bounds.pad(0.08));
}
$('#riverFilter').addEventListener('change', (e) => setRiverFilter(e.target.value));

/* ============================== init ============================== */
(async function init() {
  try { state.religionRuling = await fetchJSON('data/religion_ruling.json'); } catch (e) { state.religionRuling = {}; }
  renderStandards();
  await setRiverFilter('all');
})();
