# Sabarmati water quality — notes

## What this file is

10 water-quality stations on the Sabarmati main stem, from Dharoi Dam
(upstream) to Vautha (downstream of Ahmedabad): Dharoi Dam, Kheroj Bridge,
Mahudi, Chiloda, Hansol Bridge, Railway Bridge, V.N. Bridge, Miroli,
Vasna–Narol Bridge, Vautha. Series years: **2018, 2020, 2023**.

## The series is NOT like-for-like — read this first

The three years come from three different kinds of measurement and must not
be read as a continuous annual series:

- **2018**: CPCB polluted-river-stretch BOD maxima, as reproduced by the
  Centre for Science and Environment ("River pollution plaguing Gujarat",
  2018-era). Values: Kheroj 12, Hansol 15, Railway Bridge 29, V.N. Bridge 31,
  Miroli 103 mg/l. These are stretch maxima, not annual averages.
- **2020**: single samples from April 2020, Gujarat MPR Annexure-II (GPCB).
  April 2020 was a COVID lockdown month, so flows and loads were abnormal.
  Values: Hansol BOD 1.2, Railway Bridge 1.9, V.N. Bridge 57, Miroli 20,
  Vautha 12 mg/l. Faecal coliform was measured only in this round
  (Hansol 6.1, Railway Bridge 6.8, V.N. Bridge 45, Miroli 170, Vautha 110
  MPN/100 ml).
- **2023**: GPCB Annual Report 2022-23 yearly averages (MINARS/GEMS). Values:
  Dharoi Dam BOD 0.96, Kheroj 1.36, Mahudi 1.44, Chiloda 1.61, Hansol 1.36,
  Railway Bridge 4.6, Miroli 16.73, Vasna–Narol Bridge 48.18 mg/l.

Trends in the file (improving/stable/worsening) are computed from earliest
vs latest BOD and are **indicative only**, because the endpoints are
different kinds of measurement. The most reliable comparison is within a
single year: in 2023, Vasna–Narol Bridge (BOD 48.18, DO 1.73) is the worst
current station; in April 2020, V.N. Bridge (BOD 57, DO below detection
limit) was the worst.

## Key readings

- **Worst stretch**: downstream of Ahmedabad. CPCB's polluted-stretch report
  (2022, tabled Nov 2022) lists the Raysan–Vautha stretch at BOD max
  292 mg/l, Priority I — the second most polluted stretch in India after the
  Cooum (345 mg/l). The 2018 stretch was Kheroj–Vautha, BOD 4–147 mg/l,
  Priority I. Downstream BOD rose from 117 mg/l (2020) to 292 mg/l (2023)
  per The Secretariat — these are stretch figures, not single-station values.
- **DO below detection limit** at V.N. Bridge in April 2020 is recorded as
  DO 0 with a note (`do_2020` = 0, `do_latest` = 0).
- **Vatrak at Vautha** (BOD 26.33, GPCB 2022-23) is a tributary reading and
  is NOT used as the Sabarmati-at-Vautha series value; it is noted here only.

## Coordinates

All station points are **snapped to the nearest point on the OSM
centreline** (snap distances: Dharoi Dam 4.95 km, Chiloda 4.45 km, Railway
Bridge 3.42 km, Miroli 2.37 km, Hansol Bridge 1.63 km, Mahudi 1.31 km,
Vasna–Narol Bridge 1.33 km, Vautha 0.59 km, Kheroj Bridge 0.51 km,
V.N. Bridge 0.48 km). Base coordinates come from Nominatim geocodes, except
Kheroj (village directory coordinates, mapsofindia.com: 24.22971, 73.01388 —
0.51 km from the river line) and the two Ahmedabad bridges (snapped from
approximate geocodes).

## Gaps

- **No continuous annual series exists publicly.** There is no usable
  2014–2017, 2019, 2021, 2022, 2024 or 2025 annual series; the file has
  three non-comparable snapshots.
- **No faecal coliform series** — FC was measured only in April 2020.
- **No total nitrogen or phosphorus series** anywhere.
- **No real-time stations** with a public API on the Sabarmati.
- Kheroj and Chiloda had no sample in April 2020 (Kheroj: no flow, no
  sample; Chiloda: row blank in the MPR table) — recorded as no data, not
  zero.
