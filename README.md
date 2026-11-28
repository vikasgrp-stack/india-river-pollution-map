# India River Pollution Map

A public, map-first view of pollution in India's rivers: every
drain discharging into the river and what it adds, treatment plants and how
well they work, water-quality stations, the people living along the corridor,
and a prioritised action list (worst first) with who is responsible.

Five rivers live on one page with a river switcher: Ganga, Yamuna,
Sabarmati, Cauvery, Godavari.

## Stack

Plain static site — no build step, no backend, no API keys.

- [Leaflet](https://leafletjs.com/) for the map
- Satellite view: free Esri World Imagery tiles
  (`server.arcgisonline.com`, no key, attribution shown) with Esri
  World Transportation + World Boundaries and Places reference overlays
- Street view: OpenStreetMap tiles

## Data

Government sources only where they exist (CPCB, NMCG, Ganga Knowledge
Portal, Election Commission, Census of India, state boards); every number
shows its source inline on the page. Population uses GHSL / WorldPop where
no government equivalent exists, labelled as such. Gaps are stated openly —
where a figure is not publicly disclosed, the card says so instead of
guessing.

- `data/ganga/` — 609 drains, 145 treatment plants (+6 commissioned
  2024–2026), 115 water-quality stations, 493 towns, 20 drain courses,
  25 industries, 10 km corridor
- `data/yamuna/` — 50 drains, 115 treatment plants, 35 water-quality
  stations, 45 towns, 2 drain courses, corridor population
- `data/sabarmati/` — 11 drains, 24 treatment plants, 10 water-quality
  stations, 12 towns, 10 km corridor (counts from
  `data/sabarmati/analysis.json`, verified 2026-11-27)
- `data/cauvery/` — 14 drains, 68 treatment plants, 22 water-quality
  stations, 41 towns
- `data/godavari/` — 97 drains, 149 treatment plants, 86 water-quality
  stations, 87 towns

## Run locally

```text
python3 -m http.server
```

then open http://localhost:8000/

## Deploy

Static site — deploy the directory as-is on Vercel (or any static host).
No build command, no environment variables.
