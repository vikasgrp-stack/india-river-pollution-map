# Godavari river — notes

## Identity
- River: Godavari, India's second-longest river (after the Ganga) and its
  third-largest basin (~312,812 km², about 10% of India's geographical area).
- Source: Brahmagiri Mountain, Trimbakeshwar, Nashik district, Maharashtra
  (19.9300° N, 73.5275° E, per Wikipedia citing the Survey of India).
- Mouth: Bay of Bengal at Antarvedi, Konaseema district, Andhra Pradesh
  (17.000° N, 81.800° E).
- Course: Maharashtra → Telangana → Andhra Pradesh; the basin also touches
  Chhattisgarh, Odisha and Puducherry (Yanam).
- Main tributaries: left — Banganga, Kadva, Shivana, Purna, Kadam, Pranhita,
  Indravati, Taliperu, Sabari; right — Nasardi, Darna, Pravara, Sindphana,
  Manjira, Manair, Kinnerasani.

## Length
- Published length: 1,465 km (Wikipedia; Britannica).
- OSM centreline length: 1,511.3 km (OSM relation 2826093, main_stream ways
  only, measured in LAEA projection). The OSM centreline runs longer than
  the published figure, as it follows the channel meanders; the same pattern
  was seen for the Sabarmati (383.1 km OSM vs 371 km published) and the
  Ganga. The 1,465 km published figure is stated alongside wherever the
  length is shown; the 1,511.3 km figure is the length of the line actually
  drawn on the map.

## Centreline source
- OpenStreetMap relation 2826093 (type=waterway, waterway=river,
  name=Godavari, wikidata Q191314), fetched via the OSM API
  relation/full endpoint, 2026-11-27.
- 74 member ways: 53 main_stream, 21 side_stream. Only the 53 main_stream
  ways were chained into the centreline; the 21 side_stream ways are the
  delta distributaries (Gautami/Vasishta Godavari etc.) and are NOT drawn
  as the main line.
- Chaining: all 53 main_stream ways chained into ONE chain with NO gaps
  (start 73.5322° E, 19.9324° N at Trimbakeshwar; end 82.3536° E,
  16.7414° N at the Bay of Bengal). No connectors were invented.
- Simplified with tolerance 0.0005° (7,548 raw points → 1,846).
- Licence: ODbL — © OpenStreetMap contributors.

## Corridor buffer
- 10 km buffer around the centreline in Lambert Azimuthal Equal-Area
  projection centred on the river centroid (78.0718° E, 18.7891° N).
- Buffer area: 26,295 km².
- Corridor population (GHSL GHS-POP R2023A, 2020): 10,626,120 — see
  population.json. WorldPop cross-check COMPUTED: 10,559,786 (2020, 100 m,
  UN-adjusted), only 0.6% below GHSL; see population_NOTES.md.

## Gaps / limits
- The delta distributaries (Gautami and Vasishta Godavari) are not drawn
  as separate lines; the main line ends at the coast near Antarvedi.
  Towns on the distributaries (e.g. Yanam) are included in the towns
  layer as Tier 2 where they have a drain/STP/WQ row.
- Tributary centrelines are NOT drawn (only the main stem). Tributary
  drains/STPs/towns are included as points with `group` = the tributary
  name, exactly as the Sabarmati build did for its tributary towns.
