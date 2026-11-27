# Cauvery dataset — coverage and gaps summary

Built 27 November 2026 for the India River Pollution Map
(https://india-river-pollution-map.vercel.app). Schemas match the Ganga,
Yamuna and Sabarmati datasets exactly (string booleans "True"/"False"/"" in
GeoJSON, town centroids for STP locations, measured vs estimated loads kept
separate, every row carries `source` + `as_of` — except `people.csv`, which
carries provenance in `population_basis` / `mla_source` / `data_vintage` /
`coord_source`, per the Sabarmati template).

## Files (18 data files + 9 NOTES files + work/)

| File | Rows |
|---|---|
| drains.csv / drains.geojson | 14 |
| stps.csv / stps.geojson | 68 |
| water_quality.csv / water_quality.geojson | 22 |
| people.csv / people.geojson | 41 |
| stp_budgets.csv | 68 |
| industries.csv / industries.geojson | 8 |
| drain_courses.csv / drain_courses.geojson | 0 |
| cauvery_river.geojson | 1 line, 807.07 km |
| cauvery_corridor_buffer.geojson | 1 polygon, 14,330 km² |
| population.json | corridor + 41 towns |
| analysis.json | totals |

Build scripts in `work/`: `build_cauvery.py` (drains, STPs, WQ, towns,
budgets, industries, drain courses), `build_river_cauvery.py`,
`build_population_cauvery.py`, `build_analysis_cauvery.py`,
`geocode_cauvery.py`, `wiki_fetch_cauvery.py`, `parse_wiki_cauvery.py`.
Raw sources in `raw/`: CPCB STP inventory 2021; Karnataka MPRs Jan 2025
and Nov 2025; TN MPRs Feb 2021 and Aug 2026; OSM relation 2704746 XML.
KSPCB water-quality tables have no local copy (curl stalls on
kspcb.karnataka.gov.in) — full text verified via browser; URLs are in
`wq_NOTES.md`.

## Headline totals

- **River**: 807.07 km (OSM relation 2704746), Talakaveri, Kodagu
  (Karnataka) to Poompuhar, Bay of Bengal (Tamil Nadu). 10 km corridor
  buffer 14,330 km². One ~2.1 km anabranch near Mysuru excluded from the
  centreline (see `river_NOTES.md`).
- **Drains (14)**: **0 measured**, 12 estimated — 267.01 MLD / 66.75 TPD
  (published untreated flow × 250 mg/l raw-sewage BOD, Ganga v1.1 method),
  2 unmeasured (Srirangapatna 3 drains, T Narasipura 4 drains — no flow
  published). All 14 untapped. Biggest estimated: Vrishabhavathi valley
  outflow, Bengaluru — 215 MLD → 53.75 TPD (80.5% of the estimated total),
  a **2017-vintage** figure; Bengaluru treatment capacity has since risen
  to 390 MLD, so it is very likely overstated today. Next: Erode untreated
  outfalls 27.75 MLD → 6.94 TPD (pre-UGSS, Jan 2022).
- **STPs (68)**: capacity **1,464.19 MLD** (Karnataka 830.19, Tamil Nadu
  634.00); utilised 907.87 MLD (**69.7%** of the 1,303.19 MLD assessed
  capacity; 3 under-construction plants have no utilisation figure).
  **65 meet MoEFCC, 0 fail MoEFCC, 0 shown meeting NGT, 3 unassessed.**
  The 0-for-NGT is a DATA LIMIT, not a finding: no per-plant effluent BOD
  is published for any Cauvery plant. 64 operational, 1 under trial run
  (Trichy STP2), 3 under construction (V Valley new 150 MLD, 98% complete,
  due 15 Feb 2026; Kushalnagar 6.5; Madikeri 4.5).
- **Water quality (22 stations)**: series years 2009 / 2022 / 2023 / 2025
  — snapshots, not a like-for-like series (see `wq_NOTES.md`). Worst
  stretch: **Mettur to Mayiladuthurai (200 km), Priority II**, max BOD
  24 mg/l (CPCB Oct 2025 revision, 2022–23 basis; Priority I in 2018).
  Worst station with a published value: **Erode near Chirapalayam, BOD
  17.0 mg/l, DO 1.5 mg/l (2009)** — the most recent per-station value for
  the Tamil Nadu reach. Most recent per-station values anywhere: Mar 2023
  (KSPCB) — Lakshmantirtha D/S Hunsur and D/S Kattemalavadi, BOD 8.0 mg/l
  each. Karnataka stretch Ranganathittu–Satyagala, BOD 3.1–6.7, Priority IV
  (2022); its 2025-revision status is unknown.
- **Towns (41)**: Census 2011 population for 40 (sum 16,103,461;
  Poompuhar blank); all 41 have a verified current MLA (Karnataka 2023,
  Tamil Nadu 2026). Tier 1 (within 10 km buffer): 17. Tier 2: 24.
- **Corridor population (GHSL 2020): 9,022,109** in the 10 km buffer.
  WorldPop cross-check pending (remote read failed — see
  `population_NOTES.md`). Note: the first GHSL run used a too-tight
  window and returned 6,900,259; the corrected window gives 9,022,109.
- **Budgets: 0 of 68 disclosed.** No per-plant sanctioned cost, funds
  released/utilised, contractor or overrun is published anywhere. Project
  DPR figures (Srirangapatna Rs 16.30 crore; Bannur Rs 58 crore;
  Ramanagara Rs 220.17 crore; Kanakapura Rs 30 crore) are recorded in
  notes only, not as plant budgets.
- **Industries (8 aggregate rows)**: Vrishabhavathi Valley belt
  (191 industries, 8.008 MLD generated, ~4.680 MLD trade effluent to land
  — not a river discharge); Srirangapatna / Bannur / T Narasipura /
  Kollegala town aggregates (0.0196–0.027 MLD each); Trichy CETP
  (0.2014 MLD reported); Perundurai CETPs (3.681 MLD reported); Tiruppur
  CETPs (65.096 MLD reported — most claim ZLD, treat as reported).
- **Drain courses: 0** — no published drain-course geometry.

## Biggest gaps (in order of importance)

1. **No measured drains.** Not one Cauvery drain has a published measured
   flow with a measured BOD. The 66.75 TPD total is an estimate dominated
   by one 2017 Bengaluru figure. Any "total pollution" claim for the
   Cauvery would be built on this estimate.
2. **No per-plant effluent values.** NGT compliance cannot be assessed for
   any of the 68 plants. The 0-meets-NGT figure must never be quoted as a
   finding.
3. **Budgets: 0 of 68 disclosed.** No sanctioned cost, funds released vs
   utilised, contractor or operator cost for any plant. (Same pattern as
   Ganga: 0 of 145.)
4. **No operators in Tamil Nadu.** The TN MPR names no operator per plant;
   Karnataka lists only the implementing agency (BWSSB / KUWS&DB / ULB).
5. **Tamil Nadu water quality is 2009-only.** The most recent per-station
   values for the entire TN reach are 17 years old; the Aug 2026 MPR gives
   only a range (BOD 2.0–4.7 across 19 stations).
6. **No drain data for most towns.** Mysuru, Mandya, Trichy, Karur,
   Mettur, Thanjavur, Kumbakonam, Mayiladuthurai and others have no drain
   rows — no published drain flow or count, not zero drains.
7. **No drain courses.** No drain alignment is published for any drain.
8. **Karnataka stretch 2025 status unknown.** The CPCB Oct 2025 revision's
   Karnataka figure was not found.
9. **WorldPop cross-check pending.** Remote read failed on this network;
   no 1.65 GB file was downloaded or left behind.
10. **No religion shares, no 20-year ruling history, no livelihood splits**
    compiled for towns — no real source found in the time available.
11. **Erode untreated figure is pre-UGSS (Jan 2022)** — the UGSS due
    May 2022 may have reduced it; no later figure found.
12. **Bhavani drain is an upper bound** — part of Bhavani's sewage joins
    the Bhavani river; the split is not published.
13. **Vintage conflicts in the Karnataka MPRs** (Ramanagara/Kanakapura
    Non-complying Jan 2025 vs Complying Nov 2025; Bannur single-plant vs
    five-plant; Srirangapatna 3.6 vs 5 MLD; utilisation detail-vs-summary
    discrepancies) — newest source governs, conflicts recorded in
    `stps_NOTES.md` and `drains_NOTES.md`.
14. **Coordinate caveats:** Kulithalai corrected (Wikipedia point was
    ~40 km south of the river); Mullur point is a school, not the GP;
    Yediyur station plotted at Maddur (no coordinates for the village);
    Satyagala Bridge vs Satthegala GP locations disagree; KR Nagar plants
    plotted at T Narasipura, Madikeri at Kushalnagar.
15. **MyNeta every-9th-row ad-script flaw** (Karnataka 200/224 rows,
    Tamil Nadu 208/234 rows parsed; missing seats verified by targeted
    search) — see `people_NOTES.md`.
16. **Schema limitation:** the WQ year columns start at 2014, so 2009
    values live only in `bod_earliest`/`bod_latest`; the six TN stations
    show trend "stable" with earliest = latest = 2009, which means "one
    snapshot only", not "no change".
