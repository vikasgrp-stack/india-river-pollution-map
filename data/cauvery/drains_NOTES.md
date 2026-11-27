# Cauvery drains — notes

## What this file is

14 drain rows discharging into the Cauvery and its tributaries. **There is no
published per-drain BOD inventory for the Cauvery** — no CPCB drain list with
measured flows and BOD exists for this river (the Ganga's 609-drain CPCB PDF
has no Cauvery equivalent), and neither the Karnataka nor the Tamil Nadu
Monthly Progress Reports publish per-drain BOD. Every load here is an
estimate from a published untreated-flow figure, or the row is unmeasured.

## Coverage

- **14 drains total: 0 measured, 12 estimated, 2 unmeasured.**
- **Estimated (12): 267.01 MLD / 66.75 TPD.** Method (Ganga v1.1): untreated
  flow × 250 mg/l raw-sewage BOD. One row (Kulithalai) uses population ×
  185 lpcd × 0.8 where no flow is published at all. Each row's
  `estimation_method` states the arithmetic.
- **Unmeasured (2)**: Srirangapatna drains (3 drains) and T Narasipura
  drains (4 drains) — the MPRs publish the drain counts but no flow, so no
  load can be estimated.
- All 14 are **untapped** (`tapped_status` = "Untapped") — no interception
  and diversion to an STP is recorded for any of them.
- Measured and estimated totals are kept separate and are never summed into a
  single "total pollution" figure.

## The rows

### Karnataka (9)

- **Vrishabhavathi valley outflow, Bengaluru — 215 MLD → 53.75 TPD
  (80.5% of the estimated BOD total).** IISc blueprint / CSIR-NEERI interim
  report, May 2021 (WP 6961/2020): sewage generated ~480 MLD (2017), working
  treatment capability 265 MLD, untreated ≈ 215 MLD flowing via
  Vrishabhavathi → Arkavathi → Cauvery. **This is a 2017-vintage estimate.**
  Bengaluru treatment capacity has since risen: the V-Valley STP capacity in
  the Nov 2025 annexure is 390 MLD (8 plants), and a new 150 MLD plant is
  98% complete — so the 215 MLD untreated figure is very likely overstated
  today. It is kept because it is the only published untreated-flow figure
  for Bengaluru's Cauvery-side outflow, and it is labelled with its vintage.
  For context, Bengaluru overall generates ~1,400 MLD and treats ~900 MLD
  (Deccan Herald / BWSSB, ~2022) — but that covers all basins, not just the
  Cauvery side.
- **Ramanagara drains (11 drains, aggregate) — 4.0 MLD → 1.00 TPD.**
  Sewage generation 10.0 MLD minus STP utilised 6.0 MLD (Karnataka MPR
  Jan 2025, Arkavathi section).
- **Kanakapura drains (5 drains, aggregate) — 0.6 MLD → 0.15 TPD.**
  Generation 4.4 MLD minus STP utilised 3.8 MLD (same source).
- **Srirangapatna drains (3 drains) — unmeasured.** Flow not published; the
  drains are being connected to a wet well to pump to the STP (Karnataka MPR
  Jan 2025).
- **T Narasipura drains (4 drains) — unmeasured.** Flow not published
  (Karnataka MPR Jan 2025).
- **Mullur GP drains (2 drains) — 0.24 MLD → 0.06 TPD.** Sewage generation
  0.24 MLD, no STP (Karnataka MPR Jan 2025).
- **Harale GP drains (5 drains) — 0.14 MLD → 0.04 TPD** (0.035 TPD rounded
  to 2 dp). Sewage generation 0.14 MLD, no STP (same source).
- **Yedkuri / Satthegala drains (1 drain) — 0.018 MLD → 0.00 TPD.** The load
  is 0.0045 TPD — small, not zero; it rounds to 0.00 at 2 dp. Sewage
  generation 0.018 MLD, no STP (same source).
- **Kollegala unconnected areas — 1.69 MLD → 0.42 TPD.** Generation 6.19 MLD
  minus STP utilised 4.5 MLD (detail table, Karnataka MPR Jan 2025; the
  summary table says 6.0 MLD utilised — see the discrepancy note below).
  Isolated areas (HosaAnagalli, Shankanapura, Upparamole, Bendarahalli,
  Booditittu) are not connected to the sewer network.

### Tamil Nadu (5)

- **Erode untreated sewage outfalls (aggregate) — 27.75 MLD → 6.94 TPD.**
  NGT Southern Zone order, 31 Jan 2022: ~27.75 MLD discharged untreated
  before UGSS completion for the remaining 85,000 households (due May 2022).
  **as_of is 2022-01 and the figure is pre-UGSS** — the UGSS may have reduced
  it since; no later untreated-flow figure for Erode was found.
- **Kumarapalayam drains (5 drains, aggregate) — 5.60 MLD → 1.40 TPD.**
  Population 71,594 (2011), sewage generation 5.60 MLD, no STP, untreated
  sewage joins the Cauvery (NGT order, 31 Jan 2022). STP proposed under
  "Nadanthai Vazhi Cauvery".
- **Pallipalayam drains (7 drains, aggregate) — 4.34 MLD → 1.08 TPD.**
  Population 40,140 (2011), sewage generation 4.34 MLD, untreated sewage
  joins the Cauvery (same order). 4.34 × 0.25 = 1.085 TPD, which rounds to
  1.08 at 2 dp.
- **Kulithalai drains (3 drains, aggregate) — 4.13 MLD → 1.03 TPD.**
  No flow published; estimated by the Ganga v1.1 population method
  (27,910 × 185 lpcd × 0.8). Drain count 3 from TN MPR Feb 2021.
- **Bhavani drains (6 drains, aggregate) — 3.50 MLD → 0.88 TPD.** Sewage
  generation 3.50 MLD (NGT order, 31 Jan 2022). **This is an upper bound for
  the Cauvery**: the order says part of Bhavani's sewage joins the Bhavani
  river and part joins the Cauvery — the split is not published.

## Coordinates

No drain has published coordinates. Each drain is plotted at the centroid of
its town (see `people.csv` for the coordinate sources). The Mullur point uses
Nominatim "Government High School Mullur" (12.38717, 76.36533) — it may not
be the stretch GP; flagged here. These are approximate discharge locations,
not surveyed outfalls.

## Sources

- Karnataka Monthly Progress Report, Jan 2025 (NGT OA 673/2018) — Arkavathi
  and Cauvery sections: drain counts, sewage generation, STP utilisation.
  File: `raw/karnataka_mpr_jan2025.pdf` (+ `.txt`).
- NGT Southern Zone order, 31 Jan 2022 (Cauvery pollution case) — Erode
  untreated flow; Kumarapalayam, Pallipalayam, Bhavani sewage generation and
  populations.
- IISc blueprint / CSIR-NEERI interim report, May 2021 (WP 6961/2020) —
  Vrishabhavathi Valley catchment: 480 MLD generated, 265 MLD treatment
  capability (2017).
- Tamil Nadu Monthly Progress Report, Feb 2021 — drain counts for
  Kumarapalayam (5), Pallipalayam (7), Kulithalai (3), Bhavani (6).
  File: `raw/tamilnadu_mpr_feb2021.pdf` (+ `.txt`).

## Gaps and caveats

- **No measured drains.** Not one Cauvery drain has a published measured flow
  with a measured BOD. The 66.75 TPD total is an estimate, dominated by one
  2017 Bengaluru figure (53.75 TPD, 80.5% of the total).
- **No drain data for most towns.** Mysuru, Mandya, Malavalli, Hunsur,
  KR Nagar, Nanjangud, Periyapatna, Hassan, Holenarasipura, Belur,
  Tiruchirappalli, Karur, Mettur, Thanjavur, Kumbakonam, Mayiladuthurai and
  Musiri have no published drain flow or count — they have no drain rows,
  not zero drains. Bannur has no drain count either (its Makanahalli
  extension goes to a septic tank → STP).
- **Vintage conflicts in the Karnataka MPR Jan 2025.** The multi-town table
  is Jan 2024 vintage for most towns; Srirangapatna and the WQ section are
  Jan 2025. Utilisation figures differ between the detail and summary tables
  for the same town: Bannur 2.36 vs 2.63 MLD; T Narasipura 3.8 vs 3.40 MLD;
  Kollegala 4.5 vs 6.0 MLD. The detail-table value is used in each case and
  the conflict is recorded here.
- **Tributary coverage is thin.** Drains are covered for the Arkavathi /
  Vrishabhavathi (Bengaluru side) and the main stem in Karnataka and Tamil
  Nadu, but no drain inventory exists for the Hemavathy, Shimsha, Kabini,
  Amaravathy or Noyyal tributaries beyond the STP rows in `stps.csv`.
- **Drain courses:** none are mapped — see `drain_courses_NOTES.md`.
