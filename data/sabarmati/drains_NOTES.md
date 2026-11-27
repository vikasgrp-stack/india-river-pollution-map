# Sabarmati drains — notes

## What this file is

11 drains that discharge into the Sabarmati, from the Polluted River Stretch
(PRS) action plan for the river in the Gujarat Monthly Progress Report, April
2020 (NGT OA 673/2018). This is the complete published drain list for the
Sabarmati — no CPCB drain inventory with per-drain BOD exists for this river
(the Ganga's 609-drain CPCB PDF has no Sabarmati equivalent).

## Coverage

- **11 drains total**: 1 measured, 8 estimated, 2 unmeasured.
- **Measured (1)**: AMC storm water drain, Danilimda — 30 MLD flow (PRS) ×
  360 mg/l BOD (drone survey, Live Ahmedabad, Feb 2023) = **10.8 TPD**.
- **Estimated (8)**: published flow × 250 mg/l raw-sewage BOD (the Ganga v1.1
  estimation method) = **323.16 MLD / 80.78 TPD**. Biggest: Pumping Station,
  Old Pirana area — 182 MLD → 45.5 TPD; Pumping Station, Old Vasna area —
  76 MLD → 19.0 TPD; Wagha Kotar / Sukhadeshwar pumping station, Pethapur —
  55.3 MLD → 13.82 TPD.
- **Unmeasured (2)**: Outfall of old city area, Danilimda (downstream of
  Vasna Barrage) and Outfall of new city area, Vasna (downstream of Vasna
  Barrage) — the PRS lists them but publishes no flow for either, so no load
  can be estimated.
- **Stated flows sum to 353.16 MLD** (all 9 drains with a published flow).
- All 11 are **untapped** (tapped = "False") — the PRS action plan lists them
  as direct discharges to the river.
- Measured and estimated totals are kept separate and are never summed into a
  single "total pollution" figure.

## Coordinates

No drain in the PRS has published coordinates. Each drain is plotted at the
centroid of the place named in the plan (Danilimda, Vasna, Pirana, Pethapur,
Koteshwar, Bhat, Nana Chiloda) — `coord_source` on each row says how the
point was obtained. Nana Chiloda uses Wikipedia 'Chiloda (Naroda)'
coordinates (23.1075, 72.6601). These are approximate discharge locations,
not surveyed outfalls.

## Sources

- Gujarat Monthly Progress Report, April 2020 (NGT OA 673/2018), PRS action
  plan for River Sabarmati — drain list and flows. File:
  `raw/gujarat_mpr_apr2020.pdf` (+ `.txt`).
- Live Ahmedabad, February 2023 (drone survey) — BOD 360 mg/l at the
  Danilimda storm drain outfall and 265 mg/l from a 60 MLD STP outfall. Only
  the Danilimda figure is used here (the 265 mg/l figure is an STP outfall,
  not a drain).

## Gaps and caveats

- **Per-drain BOD is not published for any Sabarmati drain.** Only one drain
  has a measured BOD (the Danilimda storm drain, from a 2023 drone survey).
  The other 8 loads are estimates at 250 mg/l — a standard raw-sewage figure,
  not a measurement. The two Vasna Barrage outfalls cannot be estimated at
  all because no flow is published.
- **Tributary drains are missing.** The Khari and Meshwo tributaries carry
  Ahmedabad's eastern drainage (Kharicut Canal 0.5 MLD and the Vinzol STP
  treated discharge of 185 MLD into the Khari are documented in the ESIA) but
  no per-drain inventory exists for them. The PRS list covers the main-stem
  outfalls only.
- **The list is from April 2020.** Interception works since then (the CMC
  minutes of Jan 2023 say discharge till Vasna was diverted to STPs) may have
  changed which of these outfalls still flow; no updated drain list has been
  published.
- **No COD values** are published per drain.
