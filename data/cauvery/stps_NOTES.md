# Cauvery STPs — notes

## What this file is

68 sewage treatment plants in the Cauvery basin, from the two newest
government sources: the Karnataka MPR Nov 2025 Annexure-1 (full Karnataka STP
list) and the Tamil Nadu MPR Aug 2026 STP table. Every plant is plotted at
its town centroid — no public source gives plant-site coordinates, and none
are invented.

## Coverage

- **68 plants: 41 Karnataka, 27 Tamil Nadu.**
- **Capacity 1,464.19 MLD total** (operational 1,303.19 MLD; under
  construction 161.00 MLD).
- **Utilised 907.87 MLD — 69.7% of the 1,303.19 MLD assessed capacity**
  (65 plants with a utilisation figure; the 3 under-construction plants have
  none).
- **Operational status:** 64 operational, 1 under trial run (Tiruchirappalli
  STP2, 37.0 MLD, utilised 3.50), 3 under construction.
- **Compliance:** 65 meet MoEFCC, 0 fail MoEFCC, **0 shown meeting NGT**,
  3 unassessed. This is a DATA LIMIT, not a finding — see below.

## How compliance is mapped

Both MPRs give a single "Complied / Complying" flag per plant. The mapping
follows the Sabarmati precedent:

- "Complied / Complying" → `moefcc_compliant` = "True" (the consent standard
  is BOD 20 mg/l, i.e. the MoEFCC 2017 norm), `ngt_compliant` = "" (null —
  NGT 2019 norms require BOD 10 mg/l, which cannot be inferred from a
  consent flag).
- "Non-Complying" → both "False".
- Under construction → both "" (unassessed).

**No Cauvery plant in any source used has a published per-plant effluent BOD
value.** That is why 0 plants are shown meeting NGT norms. It means the
question "does this plant meet NGT norms?" cannot be answered from the
published record — not that all plants fail.

## Karnataka (41 plants, 830.19 MLD)

Source: Karnataka MPR Nov 2025, Annexure-1 (existing STPs). All listed
"Complying".

- **Bengaluru (BWSSB), Vrishabhavathi Valley / Arkavathi PRS catchment —
  8 plants, 390 MLD:** V Valley 150 MLD ASP (utilised 150.36); Chikkabanavara
  5 SBR (4.88); Doddabele 40 SBR (39.95); Doddabele 20 SBR (**25.66 — exceeds
  its 20 MLD capacity, as published**); Kengeri 60 ASP (59.94); Mailsandra
  75 EA (67.85); Nagasandra 20 SBR (18.81); Nagasandra 20 Extended Aeration
  (14.57). All Complying, operator/maintainer BWSSB.
  - The full Bengaluru list is 34 plants. **The other 26 — K&C Valley,
    Hebbal, Bellandur, etc. — drain to the Dakshina Pinakini / Ponnaiyar
    basin, NOT the Cauvery, and are excluded.** Only the 8 plants flagged
    "Yes — under PRS" (Arkavathi PRS) are included.
- **Mysuru (KUWS&DB / concerned ULB) — 4 plants, 165.5 MLD:** Rayanakere
  60 (51); Vidyaranyapuram 67.5 (54); Hebbal 8 SBR (7.8); Kesare 30 (27).
- **Cauvery main-stem towns:** Ramanagara 7.56 Aerated Lagoon (6.5);
  Kanakapura 6.29 WSP (6.29); Srirangapatna 5 SBR (1.44 — the upgraded
  5 MLD plant; supersedes the Jan 2025 MPR's 3.6 MLD / 2.7 MLD — see
  conflicts below); Bannur 5 plants (Chamanahalli 3.8 WSP, 2.0;
  Chamnahalli Gudda 0.65 SBT, 0.2; Bismilla Nagar 0.65 SBT, 0.4; Ashraya
  Badavane 0.23 SBT, 0.23; Near Kaveri Circle 0.15 SBT, 0.1);
  T Narasipura 5.5 SBR (3.67); Kollegala 9 Extended Aeration (6);
  Mandya 9.62 OP (9.62) + 8.9 WSP (8.9); Malavalli 5.65 WSP (4.5);
  Maddur 6 WSP (1.5) + Channegowdanadoddi 0.5 MBBR (0.165);
  Hunsur 8 SBR (7); KR Nagar 1.44 WSP (1.44) + 1.45 (1.45) + 2.5 (0.9);
  Periyapatna 4.2 SBR (2.7); Nanjangud 8 SBT (3.5) + 0.3 SBT (0.3).
- **Hemavathy tributary:** Hassan 10 WSP (10); Holenarasipura 3 WSP (3);
  Belur 5 SBR (2) + 0.3 WSP (0.3) — Belur is on the Yagachi, which joins
  the Hemavathy.
- **Under construction:** V Valley new 150 MLD (SBR with ASP), 98% complete,
  due 15 Feb 2026; Kushalnagar 6.5 SBT, 94–98% complete; Madikeri 4.5 SBT,
  28% complete (land issues — see `stp_budgets_NOTES.md`). These three are
  coded `operational_status` = "under construction" (a deviation from the
  Sabarmati file, which coded due plants "operational"), for honesty.
  Proposed-only plants are excluded.

## Tamil Nadu (27 plants, 634.00 MLD)

Source: TN MPR Aug 2026, STP table. All listed "Complied".

- **Main stem:** Thanjavur 28.05 (19.50); Karur 15.0 (7.50); Namakkal 7.00
  (5.70); Tiruchirappalli 58.0 (58.00); Tiruchirappalli STP2 37.0 (3.50,
  under trial run); Mettur STP-1 0.82 (0.42), STP-2 1.92 (0.90), STP-3 5.45
  (3.00); Kumbakonam 17.0 (13.00); Mayiladuthurai 5.85 (4.00); Erode 50.55
  (30.00); Sathyamangalam 4.08 (2.00, Bhavani river).
- **Tributaries:** Salem Vellakuttai 13.0 (4.00), Anaimedu 6.0 (2.00),
  Mankuttai 35.0 (4.00), Vandipettai 44.0 (1.50) — via Thirumanimutharu /
  Sarabanga; Rasipuram 6.96 (4.60, Thirumanimutharu); Mettupalayam 8.65
  (4.20, Bhavani); Coimbatore Ukkadam 70.0 (33.32), Ondiputhur 60.0 (27.50),
  Nanjundapuram 40.0 (23.00), Kuruchi & Kuniyamuthur 30.53 (11.00) — Noyyal;
  Tiruppur 15.0 (8.20), 15.0 (5.60, expansion), 36.00 (17.50,
  Sarkarperiyapalayam), 20.0 (6.50, Chinnandipalayam) — Noyyal; Perundurai
  3.14 (1.50).
- **No operator is named per plant in the TN MPR.** The operator column is
  therefore blank for all 27 TN plants — a gap, not an omission.
- Feb 2021 figures (Erode 50.55/27.00; Trichy 58.00/58.00) are superseded by
  the Aug 2026 table and are not used.

## Plotting overrides

Two plant groups have no town row in `people.csv`, so they are plotted at
the nearest town row and the override is recorded here and in `notes`:

- **KR Nagar plants** (1.44, 1.45, 2.5 MLD) plotted at the **T Narasipura**
  centroid.
- **Madikeri 4.5 MLD** (under construction) plotted at the **Kushalnagar**
  centroid.

## Sources

- Karnataka Monthly Progress Report, Nov 2025 (NGT OA 673/2018), Annexure-1
  — full existing-STP list with capacity, technology, utilisation, compliance
  flag, under-construction status. File: `raw/karnataka_mpr_nov2025.pdf`
  (+ `.txt`).
- Karnataka Monthly Progress Report, Jan 2025 — Arkavathi and Cauvery
  sections (superseded values, kept for the conflict record below).
  File: `raw/karnataka_mpr_jan2025.pdf` (+ `.txt`).
- Tamil Nadu Monthly Progress Report, Aug 2026 — STP table.
  File: `raw/tamilnadu_mpr_aug2026.pdf` (+ `.txt`).
- Tamil Nadu Monthly Progress Report, Feb 2021 — superseded STP figures.
  File: `raw/tamilnadu_mpr_feb2021.pdf` (+ `.txt`).
- CPCB National Inventory of STPs, 2021 — checked; no per-plant effluent
  values for Cauvery plants. File: `raw/cpcb_inventory_2021.pdf` (+ `.txt`).

## Gaps and caveats

- **No per-plant effluent values.** No BOD/COD/DO outlet value is published
  for any of the 68 plants in the sources used. NGT compliance cannot be
  assessed for any plant. This is the dataset's biggest STP gap.
- **No operators in Tamil Nadu.** The TN MPR names no operator per plant.
  Karnataka plants list only the implementing/maintaining agency (BWSSB;
  KUWS&DB / concerned ULB) — no contractor or private operator names.
- **Budgets: 0 of 68 disclosed** — see `stp_budgets_NOTES.md`.
- **Vintage conflicts (Karnataka).** The Jan 2025 MPR flagged Ramanagara and
  Kanakapura **Non-complying** (Ramanagara utilised 6.0 of 7.5 MLD;
  Kanakapura 3.8 of 6.29 MLD); the Nov 2025 annexure lists both **Complying**
  with higher utilisation (6.5 and 6.29 MLD). The Nov 2025 values are used
  and the conflict is recorded here. Similarly the Jan 2025 MPR lists a
  single Bannur STP of 3.31 MLD and a Srirangapatna STP of 3.6 MLD
  (utilised 2.7); the Nov 2025 annexure lists five Bannur plants and an
  upgraded 5 MLD Srirangapatna plant. The Nov 2025 annexure is the newest
  source and governs.
- **Utilisation discrepancies within the Jan 2025 MPR** (detail vs summary
  tables): Bannur 2.36 vs 2.63 MLD; T Narasipura 3.8 vs 3.40 MLD;
  Kollegala 4.5 vs 6.0 MLD. Detail-table values are used in `drains.csv`;
  the STP file uses the Nov 2025 annexure values.
- **Doddabele 20 MLD** is listed with utilisation 25.66 MLD — above its
  capacity, as published. Not corrected.
- **Excluded Karnataka towns** (STPs exist but no link to a named Cauvery
  tributary was found in the sources): Tumkur, Anekal, Magadi, Arasikere,
  Channarayapatna, Krishnarajpet, Nagamangala, Gundlupete. They are not in
  this file; note them here rather than guessing their basin.
- **No STP rows for** the Amaravathy tributary (no plant found in the
  sources) or for the delta towns below Mayiladuthurai (no plants listed in
  the TN MPR for the delta reach).
