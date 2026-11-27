# Cauvery STP budgets — notes

## What this file is

One budget row per STP (68 rows, matching `stps.csv` by `stp_id`).
**0 of 68 plants disclose any budget figure.** No per-plant sanctioned cost,
funds released, funds utilised, contractor, award date, scheduled or actual
completion date, or cost/time overrun is published for any Cauvery plant in
the sources used. That is itself the finding — the same pattern as the Ganga
dataset (0 of 145 disclosed).

## Project-level figures (notes only, NOT plant budgets)

The following figures come from the MPRs' project descriptions. They are
recorded here and in the `notes` column of the relevant rows, but they are
NOT entered as `sanctioned_cost_crore` or any other budget field, because
they are project/DPR figures, not per-plant sanctioned costs:

- **Srirangapatna:** DPR Rs 16.30 crore (KUWS&DB, Mandya) to divert sewage
  discharged through the storm-water drain and upgrade the STP from 3.6 to
  5.0 MLD. Work order 09-05-2022; 40% complete at Jan 2025; 85% of the I&D
  civil work complete.
- **Bannur:** UGD + STP upgrade DPR Rs 58 crore.
- **Ramanagara:** DPR Rs 220.17 crore.
- **Kanakapura:** DPR Rs 30 crore.
- **V Valley new 150 MLD (Bengaluru):** 98% complete, due 15 Feb 2026.
- **Kushalnagar 6.5 MLD:** 94–98% complete; work temporarily stopped
  (heavy rain Jun–Oct 2022).
- **Madikeri 4.5 MLD:** 28% complete; land issues — 1.66 acres handed over
  by CMC Madikeri on 31-07-2017, balance 3.0 acres still pending.

## Tamil Nadu schemes (context, not plant budgets)

- **"Nadanthai Vazhi Cauvery" scheme:** 40 STPs/FSTPs to bridge the
  treatment gap, 20 STPs proposed; DPR Phase-I by WAPCOS completed.
- **10 proposed CETPs with ZLD/CRMS (41 MLD, Rs 1,647.48 crore)** in
  Erode/Namakkal along Cauvery tributaries; DPRs sent to the Government of
  India in 2022; funding awaited. These are proposed, not built, and are
  not rows in `industries.csv`.
- TN state totals for context (TN MPR Aug 2026): sewage generation
  5,500.538 MLD; 125 STPs, 2,409.63 MLD capacity; 36 CETPs, 110,922.9 KLD
  (32 operating).

## Sources

- Karnataka MPR Jan 2025 — DPR figures for Srirangapatna, Bannur,
  Ramanagara, Kanakapura; V Valley / Kushalnagar / Madikeri progress.
  File: `raw/karnataka_mpr_jan2025.pdf` (+ `.txt`).
- Karnataka MPR Nov 2025 — under-construction status.
  File: `raw/karnataka_mpr_nov2025.pdf` (+ `.txt`).
- TN MPR Aug 2026 — "Nadanthai Vazhi Cauvery" scheme; proposed CETPs;
  state totals. File: `raw/tamilnadu_mpr_aug2026.pdf` (+ `.txt`).
- CPCB National Inventory of STPs, 2021 — checked; no per-plant budget
  figures for Cauvery plants. File: `raw/cpcb_inventory_2021.pdf` (+ `.txt`).

## Gaps and caveats

- **Every budget field is blank for all 68 rows** except the `notes`
  column. No contractor, no operator cost, no annual O&M figure, no funds
  released vs utilised was found for any plant.
- The DPR figures above are the only money figures published for any
  Cauvery STP project. They are not comparable across plants (different
  scopes — some cover UGD networks, some only the STP) and are deliberately
  not entered as `sanctioned_cost_crore`.
- No annual budget or O&M figure is published for any plant. The Ganga
  dataset found annual O&M for only 27 of 145 plants (all UP); the Cauvery
  figure is 0 of 68.
