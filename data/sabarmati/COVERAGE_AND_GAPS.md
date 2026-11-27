# Sabarmati dataset — coverage and gaps summary

Built 27 November 2026 for the India River Pollution Map
(https://india-river-pollution-map.vercel.app). Schemas match the Ganga and
Yamuna datasets exactly (string booleans "True"/"False"/"" in GeoJSON, town
centroids for STP locations, measured vs estimated loads kept separate, every
row carries `source` + `as_of`).

## Files (16 data files + 9 NOTES files + work/)

| File | Rows |
|---|---|
| drains.csv / drains.geojson | 11 |
| stps.csv / stps.geojson | 24 |
| water_quality.csv / water_quality.geojson | 10 |
| people.csv / people.geojson | 12 |
| stp_budgets.csv | 24 |
| industries.csv / industries.geojson | 1 |
| drain_courses.csv / drain_courses.geojson | 0 |
| sabarmati_river.geojson | 1 line, 383.1 km |
| sabarmati_corridor_buffer.geojson | 1 polygon, 6,765 km² |
| population.json | corridor + 12 towns |
| analysis.json | totals |

## Headline totals

- **River**: 383.1 km (OSM relation 7717294; published 371 km Govt of
  Gujarat / 374 km OSM — the OSM centreline runs longer, likely the estuary
  meander), Aravalli Hills (Rajasthan) to the Gulf of Khambhat. 10 km
  corridor buffer 6,765 km².
- **Drains (11)**: 1 measured — 30.0 MLD / 10.8 TPD (Danilimda storm drain,
  BOD 360 mg/l from a Feb 2023 drone survey); 8 estimated — 323.16 MLD /
  80.78 TPD (published flow × 250 mg/l raw-sewage BOD); 2 unmeasured (the
  two Vasna Barrage outfalls, no published flow). All 11 untapped. Biggest
  estimated: Old Pirana pumping station, 182 MLD → 45.5 TPD.
- **STPs (24)**: capacity 1,324.61 MLD (Ahmedabad 1,263; Gandhinagar 10;
  Himmatnagar 17.51; Dholka 13.60; Sanand 20.50); utilised 991.0 MLD (92.7%
  of the 1,069.61 MLD assessed capacity; 2 plants have no utilisation
  figure). **3 fail both NGT and MoEFCC** (Pirana 180, Vasna 126, Vasna 240);
  **9 meet MoEFCC**; **0 are shown meeting NGT** — not a finding, but a data
  limit (see gaps). 23 operational, 1 not in operation (Rasala).
- **Water quality (10 stations)**: series years 2018 / 2020 / 2023 (not
  like-for-like — see wq_NOTES.md). Trends: 4 improving, 5 stable,
  1 worsening (V.N. Bridge). Worst current station: Vasna–Narol Bridge
  (2023: BOD 48.18 mg/l, DO 1.73). Worst stretch: Raysan–Vautha, BOD max
  292 mg/l, Priority I — the second most polluted stretch in India (CPCB
  2022).
- **Towns (12)**: Census 2011 population for 11 (sum 6,209,009; Chiloda
  blank); all 12 have a verified current MLA (11 BJP, 1 INC — Khedbrahma).
- **Corridor population (GHSL 2020): 9,420,107** in the 10 km buffer.
  WorldPop cross-check pending (see gaps).
- **Budgets: 0 of 24 plants have any disclosed cost.** Project-level figures
  exist (new Vasna 375 MLD ₹840 cr; Old Pirana ₹720 cr; deep-sea pipeline
  ₹1,478 cr) but are not per-plant and are never summed.
- **Industries**: 1 aggregate row — 7 Ahmedabad CETPs, 120.88 MLD consented
  capacity. **Drain courses: 0** — none published.

## Sources (all public, all cited per row)

- Gujarat Monthly Progress Report, April 2020 (NGT OA 673/2018) — PRS action
  plan: drain list + flows, CETPs, water quality April 2020.
- Gujarat Monthly Progress Report, April 2021, Annexure-I(A) — STP capacity,
  utilisation, operational status, compliance flags (March 2021).
- CPCB National Inventory of Sewage Treatment Plants, March 2021 — STP
  annexure tables (primary source where it disagrees with the MPR).
- GPCB Annual Report 2022-23 (MINARS/GEMS) — 2023 water-quality averages.
- CPCB polluted river stretches report 2022 — Raysan–Vautha, BOD max 292.
- World Bank ESIA, new 375 MLD STP at Vasna, Ahmedabad (2022) — Vasna 126
  outlet BOD 44.8 mg/l; Ahmedabad sewerage context.
- NMCG Central Monitoring Committee minutes, 10 Jan 2023 — Ahmedabad context.
- Gujarat High Court suo motu PIL C/WPPIL/98/2021 (2024) — AMC/GPCB findings.
- Census of India 2011 (via Wikipedia infoboxes, District Census Handbook,
  village directories) — town populations; MyNeta (ADR) Gujarat 2022 winners
  list + Wikipedia constituency articles (ECI results) — MLAs.
- GHSL GHS-POP R2023A (2020) via the JRC AWS mirror — corridor population.
- OpenStreetMap relation 7717294 (via the OSM API; Overpass failed) — river
  line.

## Gaps left open (every one is stated in the relevant NOTES file too)

1. **Per-drain BOD is not published for any Sabarmati drain.** 8 of 11 loads
   are estimates at 250 mg/l; 2 drains cannot be estimated at all (no flow).
   There is no Sabarmati equivalent of the Ganga's CPCB drain inventory.
2. **No per-plant effluent values** (BOD/COD/TSS/FC/TN) except Vasna 126
   (BOD 44.8 mg/l). Hence **0 plants shown meeting NGT norms** — a data
   limit, not a finding. The MPR's single Compliance/Non Compliance flag is
   the only compliance source, and its March 2021 vintage is contradicted by
   the Gujarat High Court / GPCB 2024 findings (9 of 14 Ahmedabad STPs not
   meeting standards).
3. **Budgets: 0 of 24 disclosed** — no sanctioned cost, funds released /
   utilised, contractor, award date or overrun for any plant.
4. **No operator names** published per plant.
5. **WorldPop cross-check pending** — data.worldpop.org does not serve HTTP
   range requests through this network, so the 1.65 GB India file must finish
   downloading locally (`work/worldpop_ind_2020.tif`, 163,647,488 bytes at
   09:16 UTC, 27 Nov 2026, ~10% complete). Re-run
   `work/build_population_sabarmati.py` once it completes, then delete the
   1.65 GB file.
6. **Water-quality series is three non-comparable snapshots** (2018 stretch
   maxima via CSE; 2020 single lockdown-month samples; 2023 yearly
   averages). No continuous annual series, no FC series, no TN/P series, no
   real-time stations.
7. **No drain courses** — no published geometry, no named OSM ways.
8. **Tributary drains missing** — Khari/Meshwo (eastern Ahmedabad) have no
   per-drain inventory; only the Kharicut Canal (0.5 MLD) and Vinzol STP
   discharge (185 MLD into the Khari) are documented.
9. **Chiloda population not found** (Mota Chiloda village, no published
   Census 2011 figure retrieved).
10. **No religion shares, no 20-year ruling history, livelihoods qualitative
    only** for Sabarmati towns (same convention as Yamuna towns).
11. **No Rajasthan STPs** on the upper Sabarmati; no STP rows for Prantij,
    Modasa, Kheda, Kalol, Dehgam, Bavla, Viramgam.
12. **All STP points are town centroids** (no plant-site coordinates
    published); all drain points are place centroids (no surveyed outfalls);
    WQ points are snapped to the river centreline (snap distances recorded in
    the build log and wq_NOTES.md).
13. **Kherwara (Rajasthan) excluded** from the people layer — 61.5 km from
    the main stem, on the Wakal tributary system, no drain/STP. **Khambhat
    included as Tier 2** (river-mouth town, no STP/drain row).

## Validation performed

- All GeoJSON/CSV files parse; feature counts match CSV row counts.
- No JSON booleans in GeoJSON properties (all "True"/"False"/"" strings).
- Every drain/STP/WQ row has `source` + `as_of`.
- Estimated drain BODs recomputed from flow × 0.25 and match exactly.
- STP capacity sum 1,324.61 MLD; IDs unique; all coordinates in bounds.
- All 10 WQ points lie on the river centreline after snapping.
- River length 383.14 km (LAEA); buffer area 6,765 km².
- Build scripts (reproducible): `work/build_sabarmati.py` (drains, STPs,
  WQ, people, budgets, industries, courses),
  `work/build_population_sabarmati.py` (GHSL + WorldPop),
  `work/build_analysis_sabarmati.py` (analysis.json),
  `work/build_river_sabarmati.py` (river line + buffer).

## Wiring needed after review (NOT done — per the task)

- Add a `sabarmati` entry to the RIVERS registry in `app.js` (data folder
  `data/sabarmati/`).
- Extend `loadRiverData`'s `stp_budgets.csv` load (currently
  `if (river === 'yamuna')`) to Sabarmati.
- The app loads `stps.geojson` for Sabarmati (Yamuna pattern), not the Ganga
  `stp_accountability.geojson`.
- Do not push to GitHub until reviewed.
