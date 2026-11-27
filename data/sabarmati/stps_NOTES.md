# Sabarmati STPs — notes

## What this file is

24 sewage treatment plants on the Sabarmati corridor: 20 in Ahmedabad, 1 in
Gandhinagar (Sargasan), 1 in Himmatnagar, 1 in Dholka, 1 in Sanand. Total
designed capacity **1,324.61 MLD**; utilised **991.0 MLD** (92.7% of the
1,069.61 MLD of assessed capacity — 2 plants have no utilisation figure).

## Sources

- Gujarat Monthly Progress Report, April 2021, Annexure-I(A) "Details of
  each existing STP in the State" — capacity, utilised, operational status
  and a single Compliance / Non Compliance flag, as of March 2021. File:
  `raw/gujarat_mpr_apr2021.pdf` (+ `.txt`).
- CPCB National Inventory of Sewage Treatment Plants, March 2021 — town-wise
  annexure tables (capacity, utilisation, technology, compliance). File:
  `raw/cpcb_inventory_2021.pdf` (+ `.txt`). The CPCB inventory is the primary
  source where the two disagree (see below).
- World Bank ESIA for the new 375 MLD STP at Vasna, Ahmedabad (2022) — Vasna
  126 MLD outlet quality (BOD 44.8 mg/l). File:
  `raw/vasna375_esla_worldbank.pdf` (+ `.txt`).
- NMCG Central Monitoring Committee minutes, 10 January 2023 (NGT OA
  673/2018) — Ahmedabad context (1,300 MLD generation, 14 STPs ~1,200 MLD,
  4 STPs of 122 MLD in progress, 1 CETP 30 MLD under trial run; 18% UASB /
  50% ASP / 32% SBR).
- Gujarat High Court suo motu PIL C/WPPIL/98/2021 (2024) — AMC affidavit and
  GPCB findings (see "Contradiction" below).

## Compliance mapping — read this before using the flags

The MPR gives a **single** Compliance / Non Compliance flag per plant, not
per-parameter values. It is mapped as follows:

- **"Non Compliance" → ngt_compliant "False" AND moefcc_compliant "False".**
  A plant failing its consent standards (consent BOD 20 mg/l, i.e. the
  MoEFCC 2017 norm) fails both NGT 2019 (BOD 10) and MoEFCC 2017. Three
  plants: Pirana 180 MLD, Vasna 126 MLD, Vasna 240 MLD.
- **"Compliance" → moefcc_compliant "True", ngt_compliant "" (null).** Meeting
  the consent standard (BOD 20) means it meets MoEFCC, but NGT (BOD 10) is
  stricter, so NGT compliance **cannot be inferred** and is left null. Nine
  plants: Pirana 60, Old Pirana 106, Vasna 35, Vinzol 70, Vasna 48, Jalvihar
  Vadaj 60, Vinzol 35, Arvind Mill 8, Shahpur Shankar Bhavan 25.
- **"Not in operation" / "Information not available" / "Site not visited" →
  both flags null.** Twelve plants: Rasala, Vastrapur Lake, VS Hospital,
  Nikol, Lambha, Naroda AUDA, Vinzol 100, Pirana 155, Sargasan, Himmatnagar,
  Dholka, Sanand.
- **Result: 0 plants are shown as meeting NGT norms.** That is not a finding
  that none meet them — it is a consequence of the source data: no per-plant
  outlet BOD is published for any plant except Vasna 126 (BOD 44.8 mg/l in
  the ESIA, which fails both norms). The Ganga and Yamuna datasets have
  per-plant effluent values; Sabarmati does not.

## Contradiction — the March 2021 flags vs the 2024 court findings

The MPR's March 2021 flags say 9 Ahmedabad plants were compliant. In 2024
the Gujarat High Court (suo motu PIL C/WPPIL/98/2021) found the AMC affidavit
falsely claimed 100% STP compliance; GPCB reported the Vasna and Pirana
plants in extremely poor condition, a surplus 102 MLD of Vasna sewage going
directly to the river, and three bypass outlets at Pirana 60 MLD. AMC itself
admitted **9 of 14 Ahmedabad STPs were not meeting standards**. The MPR
vintage (March 2021) is stated on every plant row; the 2024 finding is
recorded here as a caveat. Do not read the 2021 "Compliance" flags as current.

## Discrepancies between the two sources

- Jalvihar Vadaj 60 MLD: utilised 55 MLD (CPCB inventory) vs 60 MLD (MPR).
- Vinzol 35 MLD (2020): utilised 22 MLD (inventory) vs 30 MLD (MPR).
- Shahpur Shankar Bhavan 25 MLD: utilised 17 MLD (inventory) vs 20 MLD (MPR).
- Rasala 1 MLD: MPR says "not in operation during site visit"; the CPCB
  inventory lists utilised 1 MLD. Coded as operational_status "not in
  operation" with utilised 1 MLD per the inventory — the tension is stated
  here, not resolved.
- Naroda AUDA 7 MLD: in the CPCB inventory only, not in the MPR list.
- Sanand 20.50 MLD: inventory row shows 0 MLD utilised. Coded as
  operational with 0 utilised, per the inventory table.

## Plants added from the under-construction list

- Vinzol 100 MLD (80% complete, due 30/06/2021) and Pirana 155 MLD (85%
  complete, due 30/04/2021) are added as rows with operational status
  "operational" and null utilisation/compliance — they were due to complete
  in 2021 and the CMC minutes of Jan 2023 describe 14 Ahmedabad STPs at
  ~1,200 MLD, consistent with their inclusion. With them, Ahmedabad capacity
  is 1,263 MLD.
- Dafnala 25 MLD and Koteshwar 60 MLD (proposed in the PRS) are NOT added:
  Koteshwar was dropped (land issue); Dafnala has no completion record.

## Coordinates

All STP points are **town centroids** (`coord_accuracy: "town-centroid"`).
No plant-site coordinates are published for any Sabarmati STP. Plants in the
same town share a centroid; the site's marker-spread logic separates them on
the map.

## Gaps

- **No per-plant effluent values** (BOD/COD/TSS/faecal coliform) except Vasna
  126 (BOD 44.8 mg/l, ESIA 2022). No per-plant TN value anywhere.
- **No operator names** are published per plant in the sources used.
- **No per-plant budget, contractor, award date or overrun figures** — see
  `stp_budgets_NOTES.md` (0 of 24 disclosed).
- **No Rajasthan STPs.** No STP rows exist for the upper Sabarmati in
  Rajasthan (Kherwara/Dhariawad/Salumbar); only Udaipur city plants, which
  are not on the Sabarmati.
- **No STP rows** for Prantij, Modasa, Kheda, Kalol, Dehgam, Bavla or
  Viramgam in the CPCB inventory.
- Technology is recorded where the inventory/MPR states it (ASP, UASB, SBR,
  MBBR, MBR, Electro Oxidation, Extended Aeration); blank where not stated.
