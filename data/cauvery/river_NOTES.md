# Cauvery river line and corridor — notes

## What this file is

The Cauvery centreline and its 10 km corridor buffer, built from OpenStreetMap
relation **2704746** (name `Kāveri`, alt_name `Cauvery`, wikidata Q216239).
Raw relation XML is in `raw/osm_cauvery_relation.xml`. The build script is
`work/build_river_cauvery.py`; stats are in `work/river_stats.json`.

## The centreline

- **807.07 km**, Talakaveri, Kodagu district, Karnataka (75.5336, 12.3843) to
  Poompuhar, Bay of Bengal, Tamil Nadu (79.8579, 11.1367).
- **42 ways chained, 5,514 raw points (1,180 simplified).** The relation has
  51 ways: 37 `main_stream`, 7 `side_stream`, 7 blank-role. Chaining only
  `main_stream` left 4 chains with 17.7 km and 31.5 km gaps and only 264.7 km
  of main chain. The 7 blank-role ways proved to be main-stem continuations
  (KRS reservoir reach, Hogenakkal gorge, delta reach Trichy→Poompuhar), so
  the script chains `main_stream` + blank-role and excludes the 7
  `side_stream` ways.
- A 14 m rounding gap at the Poompuhar mouth was joined by a post-pass that
  merges chain ends <100 m apart.
- **One remaining 2-way chain is excluded**: 34 points, 76.594–76.612E,
  12.416N, near Mysuru — a ~2.1 km anabranch of the main stem. It is not part
  of the centreline; the main chain passes it by.
- First attempt used relation 15048843 — wrong/empty (OSM API returned
  0 bytes). Relation 2704746 was found via Nominatim search. Overpass
  (`overpass-api.de` returned 406; `overpass.kumi.systems` unreachable)
  failed, as for Sabarmati; the OSM API `relation/2704746/full` worked.

## Corridor buffer

- **10 km buffer, 14,330 km²** (Lambert Azimuthal Equal-Area, centred
  77.5098E/11.7888N, computed in `work/build_population_cauvery.py`).
- Centreline bounds: lon 75.5336–79.8579, lat 10.8298–12.6237.

## Sources

- OpenStreetMap relation 2704746, downloaded 27 November 2026.
- The ~800 km published length (e.g. Wikipedia, CPCB) matches the 807.07 km
  OSM centreline; the extra ~7 km is the estuary/delta meander and the KRS
  reservoir reach.

## Gaps and caveats

- The excluded Mysuru anabranch (above) is a real channel, not surveyed here.
- The centreline is a simplified OSM line (1,180 points); it is not a
  surveyed thalweg. Drain and WQ points are snapped to it, so snapping
  distances are approximate.
- No published river-line geometry exists for the tributaries (Arkavathy,
  Vrishabhavathi, Hemavathy, Shimsha, Kabini, Bhavani, Amaravathy, Noyyal);
  only the main stem is mapped.
