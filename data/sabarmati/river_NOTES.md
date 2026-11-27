# Sabarmati river line — notes

## What this file is

The Sabarmati centreline (`sabarmati_river.geojson`, single LineString) and
the 10 km corridor buffer (`sabarmati_corridor_buffer.geojson`, single
Polygon), built from OpenStreetMap relation **7717294**.

## How it was built

- Overpass API failed twice: the main instance returned HTTP 406 (Not
  Acceptable) on both POST and GET, and the fallback instance
  (overpass.kumi.systems) timed out with an empty response.
- Fallback used: the OSM API
  `https://api.openstreetmap.org/api/0.6/relation/7717294/full` — HTTP 200,
  223,851 bytes, **10 ways, 1,138 nodes**, saved as
  `raw/osm_sabarmati_relation.xml`.
- Build script `work/build_river_sabarmati.py` (adapted from the Yamuna
  `build_river.py`): parses the XML, follows the relation members in order,
  chains the ways, projects to Lambert Azimuthal Equal-Area centred on the
  river centroid, builds the 10 km buffer. Result: **1 chain, no gaps**,
  simplified to 478 points. Stats in `work/river_stats.json`.

## Length — an honest discrepancy

- **OSM centreline as built: 383.14 km** (LAEA).
- Published figures: **371 km** (Government of Gujarat) and **374 km** (OSM).
- The OSM centreline runs longer, most likely because it follows the estuary
  meander down to the Gulf of Khambhat. The file reports 383.1 km and states
  the published figures here rather than forcing a match.

## Identity (verified)

- Origin: Aravalli Hills near Tepur village, Udaipur district, Rajasthan
  (~762 m elevation). Start of the built line: (73.3048655, 24.58327).
- Mouth: Gulf of Khambhat, Arabian Sea. End of the built line:
  (72.393894, 22.2713059).
- Catchment: 21,674 sq km; states: Rajasthan, Gujarat.
- Tributaries: left-bank Wakal, Harnav, Hathmati, Watrak; right-bank Sei;
  plus Meshwo, Mazam. Dharoi Dam is the major reservoir.
- Buffer area: **6,765 km²**.

## Gaps

- The 10.6 km Farakka-style gap problem does not arise here — the Sabarmati
  relation chains cleanly with no gaps.
- The river line is the OSM centreline; it is not a surveyed channel and
  carries no flow or width data.
