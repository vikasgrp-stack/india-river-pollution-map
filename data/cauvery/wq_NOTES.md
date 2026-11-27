# Cauvery water quality — notes

## What this file is

22 water-quality stations on the Cauvery and its tributaries, with BOD / DO /
faecal coliform values. **The years are snapshots, not a continuous series,
and they are not like-for-like.** The 2009 values are CPCB annual-summary
values; 2022 and 2023 are KSPCB March monthly samples; 2025 is a single-month
sample from the Karnataka MPR. No station has a continuous annual series.

## Coverage

- **22 stations: 16 Karnataka, 6 Tamil Nadu.**
- **Series years: 2009, 2022, 2023, 2025** (see the schema note below).
- **No pH values** are published for any Cauvery station in the sources used
  — all `ph_*` columns are blank.
- Trends in the file (`bod_trend`) are computed from the available snapshots
  only: 2 improving, 2 worsening, 18 stable (most "stable" rows have a single
  snapshot, so the trend is a placeholder, not a finding).

## The worst stretch and the worst stations

- **Worst stretch (CPCB): Mettur to Mayiladuthurai, 200 km, Tamil Nadu —
  Priority II** (CPCB Oct 2025 revision, 2022–23 basis; it was Priority I in
  2018). Maximum BOD **24 mg/l** (TN MPR Aug 2026). The 2022 CPCB report
  listed the same reach as Mettur to Pichavaram, maximum BOD 17.0, Priority
  III.
- **Worst station with a published value: Erode near Chirapalayam — BOD
  17.0 mg/l, DO 1.5 mg/l, FC 5,400 MPN/100 ml** (CPCB 2009). Next:
  Tiruchirapalli BOD 15.7; Trichy Grand Anicut BOD 8.4, DO 3.3;
  Pallipalayam BOD 7.5, DO 2.8; Mettur BOD 4.3; Pitchavaram BOD 4.0, DO 1.8.
  **All of these are 2009 values** — the most recent per-station values
  published for the Tamil Nadu reach.
- **Most recent per-station values anywhere are Mar 2023 (KSPCB):**
  Lakshmantirtha D/S Hunsur BOD 8.0, D/S Kattemalavadi BOD 8.0, Arkavathi
  D/S Kanakapura BOD 7.0.
- **Karnataka stretch (CPCB 2022): Ranganathittu to Satyagala Bridge, BOD
  3.1–6.7 mg/l, Priority IV.** The Lok Sabha table summarising the same
  report says "Along Sri Rangapattanna 6.0, Priority V" — the two summaries
  disagree; both are recorded here. **The Karnataka stretch's status in the
  CPCB Oct 2025 revision is unknown** — a gap.
- CPCB monitors the Cauvery at 62 locations (33 Karnataka, 28 Tamil Nadu,
  1 interstate at Ajibore).

## Schema limitation — 2009 values

The schema's year columns start at 2014 (`bod_2014` … `bod_2025`), so the
2009 values have no `bod_2009` column. They live only in `bod_earliest` /
`bod_latest` (and `do_latest` / `fc_latest`). Consequence: the six Tamil
Nadu stations show `bod_trend` = "stable" with earliest = latest = 2009.
That "stable" means "one snapshot only", not "no change". Do not read it as
a trend. The 2022/2023/2025 values do sit in their year columns.

## Karnataka stations (16)

KSPCB monthly PRS tables, Mar–Apr 2022 and Mar 2023. The March value is used
as the year's value; where the April 2022 value differs it is recorded here.

- **Arkavathi D/S Kanakapura:** Mar 2022 DO 4.4 / BOD 9.0 / FC 8,400 /
  TC 160,000; Apr 2022 5.9 / 5.0 / 4,900 / 54,000; Mar 2023 4.9 / 7.0 /
  840 / 9,200. Trend "improving" (9.0 → 7.0, March-to-March single samples).
- **Arkavathi T.G. Halli:** Mar 2022 5.2 / 6.0 / 790 / 9,200; Apr 2022
  4.8 / 8.0 / 6,300 / 54,000; Mar 2023 5.0 / 4.0 / 3,400 / 54,000.
- **Cauvery D/S Srirangapatna road bridge:** Mar 2022 6.0 / 4.0 / 260 /
  1,500 (Apr not shown); Mar 2023 6.2 / 3.0 / 110 / 1,400; Jan 2025
  (MPR) DO 6.7 / BOD 2.3 / FC 120 / TC 1,300 (right bank, Wellesley Bridge
  intake — a separate station row).
- **Cauvery Ranganathittu:** Mar 2022 6.4 / 2.8 / 210 / 1,400; Mar 2023
  6.6 / 2.5 / 110 / 1,500; Jan 2025 (MPR) DO 6.7 / BOD 2.0 / FC 92 /
  TC 1,100 (Bird Sanctuary D/S).
- **Cauvery Satyagala Bridge:** Mar 2022 6.3 / 2.5 / 270 / 1,200; Mar 2023
  6.6 / 2.0 / 140 / 1,500.
- **Cauvery Mandya intake (left bank):** Jan 2025 only — DO 6.6 / BOD 2.4 /
  FC 120 / TC 1,400.
- **Cauvery Mysore–Bangalore Road Bridge D/S:** Jan 2025 only — DO 6.5 /
  BOD 2.4 / FC 120 / TC 1,300.
- **Kabini Bathing Ghat, Nanjanagud:** Mar 2022 6.2 / 3.0 / 250 / 1,300;
  Apr 2022 5.0 / 4.4 / 330 / 1,500; Mar 2023 6.0 / 3.0 / 150 / 1,700.
- **Kabini T. Narasipura intake:** Mar 2022 6.9 / 1.4 / 68 / 700; Apr 2022
  6.4 / 2.0 / 260 / 1,100; Mar 2023 6.4 / 3.0 / 140 / 1,300.
- **Lakshmantirtha D/S Hunsur:** Mar 2022 5.4 / 4.4 / 480 / 2,200; Apr 2022
  5.6 / 4.0 / 340 / 1,400; Mar 2023 **2.5 / 8.0** / 210 / 2,400.
  Trend "worsening" (4.4 → 8.0) — but this is March-to-March single
  samples, not a trend; the Mar 2023 DO of 2.5 mg/l is the lowest DO in the
  file.
- **Lakshmantirtha D/S Kattemalavadi:** Mar 2022 5.7 / 4.2 / 470 / 2,200;
  Apr 2022 5.8 / 4.2 / 340 / 1,400; Mar 2023 4.3 / 8.0 / 220 / 2,400.
  Trend "worsening" (4.2 → 8.0), same caveat.
- **Lakshmantirtha Hunsur water-supply intake:** Mar 2023 only — 4.4 / 5.0 /
  170 / 2,100.
- **Shimsha Halagur bridge:** Mar 2022 5.8 / 4.0 / 250 / 1,500; Mar 2023
  5.7 / 4.0 / 150 / 2,200.
- **Shimsha near Yediyur (NH-47):** Mar 2022 6.1 / 4.0 / 9,400 / 54,000;
  Apr 2022 6.2 / 4.0 / 1,300 / 24,000; Mar 2023 6.0 / 5.0 / 630 / 16,000.
  No published coordinates exist for Yediyur village, Maddur taluk — the
  station is plotted at the Maddur centroid.
- **Shimsha D/s near Maddur town:** Mar 2022 5.5 / 4.3 / 220 / 1,700;
  Mar 2023 5.6 / 4.0 / 170 / 2,100.
- **Yagachi near Hassan pumping station:** Mar 2022 5.4 / 2.4 / 270 / 1,700;
  Apr 2022 5.2 / 2.6 / 290 / 1,700. (2022 only — no Mar 2023 row published.)

## Tamil Nadu stations (6)

All from CPCB "Status of Water Quality in India 2009" (MINARS/2009-10),
chapter XVIII, Cauvery Basin — the earliest snapshot, not current. Overall
basin ranges in that report: BOD 0.1–17 mg/l; DO 1.5–10.3; FC 2–5,400
MPN/100 ml; TC 7–9,200.

- Mettur BOD 4.3; Erode near Chirapalayam BOD 17.0, DO 1.5, FC 5,400,
  TC 9,200; Pallipalayam BOD 7.5, DO 2.8; Tiruchirapalli BOD 15.7;
  Trichy Grand Anicut BOD 8.4, DO 3.3; Pitchavaram BOD 4.0, DO 1.8.
- **Pitchavaram (CAU-22) is NOT snapped to the centreline.** It sits on the
  Pichavaram backwaters ~31 km south of the mapped centreline end at
  Poompuhar; snapping would misplace it. It keeps its geocoded coordinates.
- Excluded for lack of a BOD value (noted here, not silently dropped):
  Coleroon (DO 2.6, no BOD) and 1 km D/s of the Bhavani confluence
  (fails criteria, no BOD stated).
- Tributaries failing criteria in 2009 (no station rows — no BOD/DO values
  published per station): Bhavani at Elachivazhy, Pathirakaliamman Koil,
  Sirumugai, Bhavani Sagar; Kabini at Muthankara and the KIADB water intake
  (Nanjangud); Arkavathi at Kanakapura D/s; Lakshmantirtha at D/s Hunsur;
  Amaravathi at 1 km D/s of the effluent discharge point, Madhuthukkulam.
  Also Sri Rangapattanna D/s DO 3.8 (no BOD stated).

## Coordinates

Main-stem stations are snapped to the centreline; tributary stations keep
their geocoded coordinates (not snapped). The Satyagala Bridge row uses the
Satthegala GP coordinates (12.240843, 77.1412364) from the Karnataka MPR;
a separate search put "Satyagala" at 12.3066474, 76.1383470 — the two
locations disagree and the MPR's is used, flagged here.

## Sources

- CPCB, "Status of Water Quality in India 2009" (MINARS/2009-10), ch. XVIII
  Cauvery Basin — 2009 station values and basin ranges.
- KSPCB, "Water Quality of 17 PRS March & April 2022" — Mar–Apr 2022 table.
  https://kspcb.karnataka.gov.in/sites/default/files/inline-files/Water%20Quality%20of%2017%20PRS%20March%20%26%20April%202022%20%281%29.pdf
  (No local copy: curl stalls on kspcb.karnataka.gov.in; full text read and
  verified via browser, 27 Nov 2026.)
- KSPCB, "Water quality PRS Mar-23" — Mar 2023 table.
  https://kspcb.karnataka.gov.in/sites/default/files/inline-files/Water%20quality%20PRS%20Mar-23.pdf
  (Same — no local copy; verified via browser, 27 Nov 2026.)
- Karnataka MPR Jan 2025 — Jan 2025 WQ at 4 main-stem stations.
  File: `raw/karnataka_mpr_jan2025.pdf` (+ `.txt`).
- TN MPR Aug 2026 — Cauvery range only: BOD 2.0–4.7 mg/l across 19
  monitoring locations (no per-station values, so no 2026 values in this
  file). File: `raw/tamilnadu_mpr_aug2026.pdf` (+ `.txt`).
- CPCB polluted-stretch reports (2022; Oct 2025 revision via TN MPR Aug 2026
  and the Neer Vazhvu atlas) — stretch priorities and maxima.
- TN MPR Feb 2021 — Cauvery 19 stations BOD <2–4.2 mg/l (range only).
  File: `raw/tamilnadu_mpr_feb2021.pdf` (+ `.txt`).

## Gaps and caveats

- **No continuous series.** No station has annual values across the years;
  the file is four snapshots (2009, 2022, 2023, 2025) from three different
  sampling regimes. Trends are indicative only.
- **Tamil Nadu is 2009-only.** The most recent per-station values for the
  entire TN reach are 17 years old. The TN MPR Aug 2026 gives only a range
  (BOD 2.0–4.7 across 19 stations) — it cannot be attached to any station.
- **No pH anywhere.** No pH value is published for any Cauvery station in
  the sources used.
- **No faecal coliform after 2025 (Karnataka) / after 2009 (Tamil Nadu).**
- **Karnataka stretch 2025 status unknown** — the Oct 2025 CPCB revision's
  Karnataka figure was not found.
- **Satyagala coordinate discrepancy** (see Coordinates above).
