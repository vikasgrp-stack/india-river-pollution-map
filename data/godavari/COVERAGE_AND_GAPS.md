# Godavari dataset — coverage and gaps summary

Built 27 November 2026 for the India River Pollution Map
(https://india-river-pollution-map.vercel.app). Schemas match the Ganga,
Yamuna and Sabarmati datasets exactly (string booleans "True"/"False"/""
in GeoJSON, town centroids for STP locations, measured vs estimated loads
kept separate, every row carries `source` + `as_of`).

## Files (16 data files + 9 NOTES files + work/)

| File | Rows |
|---|---|
| drains.csv / drains.geojson | 97 |
| stps.csv / stps.geojson | 149 |
| water_quality.csv / water_quality.geojson | 86 |
| people.csv / people.geojson | 87 |
| stp_budgets.csv | 149 |
| industries.csv / industries.geojson | 10 |
| drain_courses.csv / drain_courses.geojson | 0 |
| godavari_river.geojson | 1 line, 1,511.3 km |
| godavari_corridor_buffer.geojson | 1 polygon, 26,295 km² |
| population.json | corridor + 87 towns |
| analysis.json | totals |

## Headline totals

- **River**: 1,511.3 km OSM (relation 2826093; published 1,465 km —
  the OSM centreline follows meanders, as for the Ganga and Sabarmati),
  Trimbakeshwar, Maharashtra → Bay of Bengal at Antarvedi, AP.
  10 km corridor buffer 26,295 km².
- **Drains (97)**: 1 measured — 8.5 TPD (Nashik city nallas aggregate,
  68 MLD × 125 mg/l BOD, NEERI 2014); 1 estimated — 13.75 TPD
  (Rajahmundry Nalla Channel, 55 MLD × 250 mg/l raw-sewage BOD, Ganga
  v1.1 method); **95 unmeasured** (named in an MPR, no published flow or
  BOD). Tapped: 18 Intercepted / 66 Untapped / 13 unknown. Biggest
  single load: the Nalla Channel, Rajahmundry (13.75 TPD, estimated).
  **The Godavari has no CPCB drain inventory** — unlike the Ganga's 609
  drains, there is no published per-drain BOD list for this river at all.
- **STPs (149)**: capacity **2,648.0 MLD** (Maharashtra 70 plants,
  Telangana 76, AP 3); operational 44, under construction 18, not in
  operation 7, proposed 80 (510.5 MLD). Utilisation published for 46
  plants: **1,053.95 MLD (74.7% of assessed capacity)** — Maharashtra
  79.7%, Telangana only 13.8%. **3 meet NGT norms** (Shirdi 16,
  Chandrapur Pathanpura 45, Rehmat Nagar 25 — all from MH MPR effluent
  values); 23 fail, 123 not assessed. **No per-plant TN or faecal
  coliform value is published anywhere**, so the low compliance count is
  partly a data limit. All 12 Nagpur plants are Non-Comply.
- **Water quality (86 stations)**: worst station Vasistha D/s
  Narasapuram, BOD **58.0 mg/l** (2019–21 max); worst stretch Maharashtra
  main stem, BOD max **28.0 mg/l** (Kapila–Godavari confluence),
  Priority II; worst DO Nakkavagu at Bachugudem, **1.6 mg/l** (Jun 2021).
  Trends: 5 improving, 2 worsening, 79 stable — but only Telangana has
  two comparable monthly points; the years are snapshots, not a
  continuous series.
- **Towns (87)**: all with Census 2011 population (summed 12,748,996)
  and verified current MLA. Featured: Nashik, Nanded, Nizamabad,
  Rajahmundry, Warangal, Kakinada.
- **Corridor population (GHSL 2020): 10,626,120; WorldPop 2020
  cross-check: 10,559,786 (computed, only 0.6% apart).**
- **Budgets: 6 of 149 plants disclose a figure (₹516.26 crore total)**;
  13 partially disclosed (scheme figures in notes only); 130
  undisclosed; **funds released/utilised disclosed for 0 of 149**;
  contractor named for 1 scheme only; no annual O&M figure anywhere; no
  operator named except SCCL Rudrampur and AMC O&M (Aurangabad).
- **Industries (10 rows)**: 2 with a consented capacity figure (Waluj
  CETP 10 MLD; Andhra Paper Ltd 31.53 MLD; total 41.53 MLD), 8
  aggregate/belt rows with no figure. No CETP in the AP stretch; no
  Godavari equivalent of the Yamuna GPI inspection.
- **Drain courses: 0** — no published drain geometry exists.

## Corrections applied at assembly (the two-Purna trap)

The Godavari and the Tapi each have a tributary called the **Purna**,
and three researchers initially swept Tapi-basin rows into this dataset.
Each was verified against sources and removed:

- **Towns**: Akola + Washim dropped from people.csv (Tapi Purna).
- **STPs/budgets**: 12 rows dropped — Akola (3), Amravati (4), Shegaon
  (2), Washim (1) on the Tapi Purna; Miryalaguda (2) on the Musi, a
  Krishna tributary. Pre-drop: 161 plants / 2,892.45 MLD.
- **Drains**: 12 Amravati rows dropped (5 Purna + 7 Pedhi drains; the
  Pedhi is a Tapi-Purna tributary). Pre-drop: 109 rows.
- **Water quality**: 3 stations dropped (Purna–Asegaon, Purna–Dhupeshwar,
  Purna–Andura — CPCB PRS 2022 places them at Achalpur–Amravati road
  bridge / Malkapur, Akola). Pre-drop: 89 stations.
- **Industries**: Patancheru CETP excluded (effluent to the Musi since
  Jul 2009); Akola/Washim/Amravati CETP excluded (Tapi Purna).
- Town spellings normalised to people.csv: Rajamahendravaram →
  Rajahmundry, Tryambakeshwar → Trimbakeshwar.

## Biggest gaps (stated plainly)

1. **Drains are the weakest layer**: 95 of 97 have no published flow or
   BOD. Telangana MPRs count 83 more drains (54 Godavari + 13 Maneru +
   11 Nakkavagu/Manjeera + 5 Karakavagu/Kinnerasani) but never name or
   locate them. No CPCB drain inventory exists for the Godavari.
2. **No per-plant TN or faecal coliform anywhere**; 123 of 149 STPs
   have no effluent value at all.
3. **Budgets**: 130 of 149 undisclosed; released/utilised 0 of 149; no
   O&M figures; no operators.
4. **Water quality is snapshots, not a series**: PRS maxima (2019–21)
   vs NWMP monthly (Jun–Jul 2021) vs AP single-month (Jan 2025). No
   Indravati/Sabari stations; no Chhattisgarh/Odisha MPR obtained.
5. **Telangana post-2022 STP status unknown** (newest MPR Jun–Aug 2022).
6. **No drain courses**; no tributary centrelines drawn (main stem only);
   delta distributaries (Gautami/Vasishta) not drawn as separate lines.
7. **Towns**: no religion shares, no 20-year ruling history, no
   urban/rural split, livelihoods qualitative only; literacy blank for 55
   towns, sex ratio for 29, area for 40.
8. **Tributary coverage**: Pranhita, Indravati, Sabari have no drain
   data; Manjira/Maner coverage comes via towns/STPs/WQ only.
9. **Nashik new-STP conflict unresolved**: MPR Mar 2026 plan
   (Tapovan-III 50 / Agar Takali-III 90 / Agar Takali-IV 70 MLD) vs Sept
   2026 Kumbh plan (Tapovan 180 / Agartakli 97 / Chehedi 64 / Panchak 75,
   ₹1,600 cr) — only the Kumbh plan is recorded, to avoid
   double-counting ~210 MLD.
10. **Banewadi ₹46 cr attribution ambiguous** (may belong to Paithan) —
    caveated on both rows.

## Sources (primary)

CPCB Polluted River Stretches 2022; CPCB National Inventory of STPs Mar
2021; Maharashtra MPR Aug 2020 + Mar 2026; Telangana MPRs Feb 2020 /
Jul 2020 / Jun–Sep 2021 (+ NWMP monthly data); AP MPR Jan 2025; NEERI
Nashik Ch.3/Ch.5 (2013–14); GPCB-style state MPRs via nmcg.nic.in;
Lok Sabha USQ 3614; AMRUT lists; NGT order; SCCL tender; Sept 2026
Kumbh news; Census 2011 + MyNeta/ECI (towns/MLAs); GHSL GHS-POP R2023A
+ WorldPop 2020 (corridor); OSM relation 2826093 (river line). Source
PDFs + extracted text kept in data/godavari/raw/ and work/industries/.

## Reproducibility

- work/build_godavari.py — assembles the final files from the drafts
  (drops + spelling normalisation).
- work/build_analysis_godavari.py — builds analysis.json.
- work/build_population_godavari.py — builds population.json (GHSL +
  WorldPop; geo venv).
- work/build_river_godavari.py — builds the river line + buffer.
- work/drains_wq/build_godavari.py, work/stps/build_godavari_stps.py,
  work/stps/build_godavari_budgets.py, work/stps/geocode_godavari.py —
  draft builders. work/worldpop_ind_2020.tif is the full 1.65 GB WorldPop
  India 2020 file (data.worldpop.org does not support byte ranges; a
  fresh full download is the only recovery if it is lost).
