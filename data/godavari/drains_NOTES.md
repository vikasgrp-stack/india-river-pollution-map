# Godavari drains — notes

## What this file is

97 drains that discharge into the Godavari and its tributaries, from the
state Monthly Progress Reports (NGT OA 673/2018), the NEERI Nashik study
(2013–14), and press reports where a government source publishes a flow.
This is NOT a complete inventory — no CPCB drain PDF with per-drain BOD
exists for the Godavari (the Ganga's 609-drain CPCB PDF has no Godavari
equivalent), and most drains in the basin have never been named, located,
or measured in any published source.

## Coverage

- **97 drains total**: 1 measured, 1 estimated, 95 unmeasured.
- **Measured (1)**: Nashik city nallas — aggregate uncollected sewage,
  68 MLD × 125 mg/l BOD (NEERI Ch.3, 2014) = **8.5 TPD**. This aggregates
  Nashik's named nallas; it is NOT additional load on top of them.
- **Estimated (1)**: Nalla Channel, Rajahmundry — 55 MLD (officials, May
  2025) × 250 mg/l raw-sewage BOD (the Ganga v1.1 estimation method) =
  **13.75 TPD**. This is the biggest single drain load in the file.
- **Unmeasured (95)**: named in an MPR but with no published flow or BOD,
  so no load can be computed. BOD concentrations exist for 18 Nashik nallas
  (NEERI 2013–14 samples, e.g. Saraswati nalla 83.0 mg/l, Forest Nursery
  nalla up to 94 mg/l) but without per-nalla flows no loads follow.
- **Tapped**: 18 Intercepted, 66 Untapped, 13 blank (no status published).
  Nashik's tapped status is NEERI 2014; Nashik press (2026) reports 7 of
  25 drains still discharging but does not name them, so per-drain status
  cannot be updated from 2014.
- Measured and estimated totals are kept separate and are never summed into
  a single "total pollution" figure.

## Sources

- Maharashtra MPR, Aug 2020 (NGT OA 673/2018), Annexure-I — the drain
  inventory (Nashik 5 named, Nanded 34 named, tributary towns).
- NEERI Nashik, Ch.3/Ch.5 (2013–14) — full 25+8 Nashik nalla list, BOD
  samples, 68 MLD aggregate, exact coordinates for 7 Nashik stations.
- Telangana MPRs Feb 2020 / Jul 2020 / Jun–Sep 2021; AP MPR Jan 2025.
- Rajahmundry press, May 2025 (55 MLD Nalla Channel flow); Nashik press,
  2026 (25 drains, 7 still discharging); Nov 2026 NGT petition
  (Rallavagu/Thollavagu, claim only).
- CPCB Polluted River Stretches 2022 (stretch list; station values are in
  the water-quality file).

## Corrections applied at assembly

- **12 Amravati rows dropped**: 5 Purna village drains + 7 Pedhi drains.
  The Purna at Amravati/Akola and its tributary the Pedhi belong to the
  TAPI basin (MPCB Purna action plan 2019; CPCB PRS 2022 places the
  Asegaon–Akola stretch in Amravati/Akola districts), not the Godavari
  system. They were all unmeasured with no flow, so the measured/estimated
  totals are unchanged.
- Town spelling normalised: Tryambakeshwar → Trimbakeshwar (to match
  people.csv).

## Gaps

- **Telangana drain names**: the Feb 2020 MPR counts 54 Godavari + 13
  Maneru + 11 Nakkavagu/Manjeera + 5 Karakavagu/Kinnerasani drains but
  never names or locates them (Annex-2 absent from all three Telangana
  MPRs on nmcg.nic.in). They are counted nowhere in this file.
- **NEERI Ch.6 Table 6.3** (per-nalla flows, Nashik) not obtained — the
  Ch.6 PDF URL was not found in search.
- **Indravati, Sabari, Pranhita**: no published drain data at all.
- **No per-drain BOD anywhere** except Nashik NEERI samples (2013–14).
- **No MH MPR newer than Aug 2020, no TS MPR newer than Sep 2021, no AP
  MPR other than Jan 2025** obtained.
- No drain courses: no published drain geometry was found for any
  Godavari drain (see drain_courses_NOTES.md).

Full per-row audit trail: work/drains_wq/drains_wq_NOTES.md.
Build script: work/drains_wq/build_godavari.py (+ geocode_cache.json).
