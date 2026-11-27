# Godavari STP budgets — notes

## What this file is

One budget row per STP (149 rows, joined to stps.csv by `stp_id`).
`budget_status` is `disclosed` / `partially disclosed` / `undisclosed`
per plant. Scheme-level figures are recorded in `notes` only and never
split across plants.

## Coverage

- **Disclosed: 6 of 149 plants, ₹516.26 crore total** — Banewadi 10 MLD
  ₹46 cr, Latur 40 MLD ₹139 cr, Beed 35 MLD ₹165 cr, Sircilla 19.1 MLD
  ₹61.25 cr, Rajahmundry new 50.6 MLD ₹88.43 cr, Rajahmundry
  decentralised 4.25 MLD ₹16.58 cr.
- **Partially disclosed: 13 of 149** — a scheme figure exists in notes
  only, never split: Aurangabad UIDSSMT ₹373.03 cr (4 plants), Nashik
  Kumbh programme ₹1,600 cr (4 plants), GWMC Smart City ₹200 cr (3
  Warangal plants), Rajahmundry NRCP project ₹21.79 cr (1 plant), Paithan
  "sanctioned, amount unstated" (1 plant).
- **Undisclosed: 130 of 149.**
- **Funds released / utilised: disclosed for 0 of 149 plants.**
- **Contractor named: 1 scheme only** (M/s Krushi Pvt Ltd, Miryalaguda).
  Award dates: none. No per-plant annual O&M budget published anywhere.
- **Operator named: none**, except SCCL Rudrampur and AMC O&M
  (Aurangabad).

## Caveats

- **Banewadi ₹46 cr attribution is ambiguous** — the figure sits between
  the Banewadi and Paithan rows in the source; it may belong to Paithan.
  Both rows carry the caveat.
- 12 budget rows were dropped at assembly with their STP rows (Akola,
  Amravati, Shegaon, Washim, Miryalaguda — outside the Godavari basin);
  all were undisclosed except Miryalaguda's 2 partially-disclosed rows
  (UIDSSMT ₹78.52 cr scheme figure, recorded in
  work/stps/stp_budgets_NOTES.md for the record).

Full per-plant audit trail: work/stps/stp_budgets_NOTES.md.
Build script: work/stps/build_godavari_budgets.py.
