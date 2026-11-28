# Ganga drains — location audit (s.advitya, 2026-11-28)

Status: audit claimed and triage done. No drain coordinates have been
moved yet — this note records what the triage found and how the fix
will be done, so no coordinate is ever invented.

## What the data is

- 609 drains in `drains.csv` + `drains.geojson` (in lockstep), all from
  one source: CPCB Pre-Monsoon 2023. No `coord_accuracy` field on any
  drain. `coords_corrected` is False for 608, True for 1 (Hapur city
  drain, Kali East tributary).
- `river` field: Ganga 410, tributaries 199 (Kali East 29, Alaknanda
  22, Yamuna 21, Ramganga 19, Varuna 19, Sone 14, Mansahaita 12,
  Pandu 9, Jargo 9, others). `group`: main stem 437, tributary 172.
- Data status: measured 374, unmeasured 171, estimated 64.
  BOD load is known for 371 drains (total 1,050.6 tpd).

## Triage (computed 2026-11-28, distance to the Ganga main-stem line
## in `ganga_river.geojson`; the river is 300–700 m wide, so a pin
## <500 m from the centreline is in the bank zone)

- <100 m: 13 | <500 m: 236 | <1 km: 92 | <2 km: 43 | <5 km: 49 |
  <10 km: 38 | >10 km: 133.
- Main-stem drains (`river` = Ganga, 410): <500 m 249, 500 m–1 km 84,
  1–2 km 25, 2–5 km 28, >5 km 24. So 77 main-stem drains are >1 km
  from the river and 52 are >2 km — those are the clear inland pins.
- Tributary drains (199): 147 are >5 km from the main stem, as
  expected — they discharge to a tributary, not the Ganga. They
  cannot be audited against the main-stem line; they need the
  tributary river lines, which are not in the repo.
- No drain pin exactly matches its town's coordinate in
  `people.geojson` (0 of 609), so the pins are not copies of the
  town file — they are geocoded place-name points, and the audit
  must check each one against its own receiving watercourse.

## Pilot — satellite checks, Esri World Imagery, 2026-11-28

- Gola Ghat Drain, Varanasi (14.78 tpd, 0.26 km): pin is on the
  riverfront at the ghats. Plausibly right; the outfall itself is
  not visible (covered drain in the old city), so MEDIUM at best —
  not claimed as verified.
- Pagal Baba Masjid Drain, Varanasi (14.78 tpd, 2.52 km from the
  Ganga centreline): pin sits ON the Varuna river channel. Its
  receiving watercourse is the Varuna, not the Ganga main stem —
  distance to the Ganga line misleads here. Lesson: audit each
  drain against its own `river` field.
- Sadar Bazar Drain, Varanasi (14.78 tpd, 5.03 km): pin is inland
  in Sadar Bazar, south of the Varuna channel visible in the tile.
  Not verified; likely a locality pin.
- Loni River / Drain, Unnao (6.57 tpd, 20.52 km): pin is in
  farmland next to a settlement, not on any visible channel. Wrong
  as an outfall point; the true outfall was not visible in the
  tile, so the pin was NOT moved.
- Rooma Drain, Kanpur (2.64 tpd, 2.01 km): pin is in farmland,
  ~2 km from the Ganga, not on a visible channel. Wrong as an
  outfall point; not moved.

## Method for the fix (no invented coordinates)

1. Work worst first: main-stem drains >2 km from the river (52),
   then 1–2 km (25), by BOD load. Tributary drains after the
   tributary lines are sourced.
2. For each drain, check Esri satellite imagery at the pin and
   trace its channel to its receiving river. Move the pin only
   where the channel/outfall is visible; otherwise leave the pin
   and mark it `town-centroid` with a note.
3. Record per drain, in GeoJSON + CSV in lockstep:
   `coord_accuracy` (satellite-verified / town-centroid),
   `coord_source` (Esri World Imagery + OpenStreetMap, verified
   <date> by s.advitya), `coord_confidence` (HIGH / MEDIUM).
   HIGH only where the outfall/channel is clearly visible;
   MEDIUM where the pin is on the right riverfront but the
   outfall itself is covered.
4. Overpass (OSM waterways) timed out from this environment on
   2026-11-28 — retry it, or use the CPCB drain inventory's
   outfall coordinates if they can be obtained, before moving
   pins that satellite alone cannot place.

## What is still open

- 52 main-stem drains >2 km, 25 at 1–2 km, and all 199 tributary
  drains (needs tributary lines).
- The same audit is still unclaimed for water-quality stations
  (115 Ganga) and industries (25 Ganga), and for the other four
  rivers' drains.
