# Godavari STPs — notes

## What this file is

149 treatment plants in the Godavari basin (Maharashtra 70, Telangana 76,
Andhra Pradesh 3; Chhattisgarh and Odisha Godavari districts have no STPs
at all), from the CPCB National Inventory of STPs (Mar 2021), the
Maharashtra MPR (Mar 2026) and Telangana MPRs (Jun 2020, Jun–Aug 2022),
plus Lok Sabha USQ 3614, AMRUT lists, an NGT order, an SCCL tender, and
Sept 2026 Kumbh news. All points are town centroids — no plant-site
coordinates are used, even though the MH MPR Mar 2026 annexure does
publish plant lat/long for many Maharashtra plants (noted in
work/stps/stps_NOTES.md if wiring wants them later).

## Coverage

- **149 plants, 2,648.0 MLD designed capacity.**
- **Status**: operational 44 (1,391.25 MLD), under construction 18
  (714.25 MLD), not in operation 7 (32.0 MLD), proposed 80 (510.5 MLD).
  Proposed and under-construction plants are included so towns without a
  working plant do not vanish; `operational_status` therefore uses four
  values (Sabarmati used two).
- **Utilisation** published for 46 plants: **1,053.95 MLD (74.7% of the
  1,410.25 MLD assessed capacity)**. Sharp state split: Maharashtra
  1,007.95 of 1,264.5 MLD (79.7%); Telangana just 16.0 of 115.75 MLD
  (13.8%) — Karimnagar's 38 MLD plant treats 2 MLD, Nizamabad's 31.5 MLD
  treats 6.5 MLD.
- **Compliance**: NGT — True 3, False 23, null 123. MoEFCC — True 20,
  False 21, null 108. The 3 NGT-True plants are Shirdi 16 MLD, Chandrapur
  Pathanpura 45 MLD and Rehmat Nagar 25 MLD — all derived from per-plant
  effluent values in the MH MPR annexure. **0 meeting NGT would be a data
  limit, not a finding**: no per-plant total nitrogen or faecal coliform
  value exists anywhere, and 123 plants have no effluent value at all.
  All 12 Nagpur plants are Non-Comply; 8 of them pass BOD/COD/TSS on
  paper, so their NGT flag is null (TN/FC may be the reason).
- **No existing STP**: Jalna city, Parbhani, Kopargaon, Paithan, Gangakhed,
  Warangal (only 2 FSTPs, 25 KLD), Kothagudem municipal (nil sewer
  connections), Adilabad (₹215.46 cr UGD awarded, no STP capacity
  published).

## Sources and discrepancies

- Primary: CPCB National Inventory of STPs, Mar 2021; Maharashtra MPR
  Mar 2026; Telangana MPRs Jun 2020 and Jun–Aug 2022.
- **Nashik new-STP conflict**: MPR Mar 2026 lists Tapovan-III 50 /
  Agar Takali-III 90 / Agar Takali-IV 70 MLD (GoM-sanctioned, due Dec
  2026); Sept 2026 news reports a different Kumbh plan (Tapovan 180,
  Agartakli 97, Chehedi 64, Panchak 75, ₹1,600 cr, due Mar 2027). Only the
  4 Kumbh plants are recorded, to avoid double-counting ~210 MLD; the MPR
  plan is in the work NOTES for reconciliation.
- Other discrepancies recorded, not guessed: Nashik utilisation 393.5 vs
  narrative 242.5 MLD; Tryambakeshwar 1 vs 1.4+0.5 MLD; Nanded Dunkin 5 vs
  7; Elichpur 12 vs 18; Somalwada-2 garbled "2" vs 20; Azad Garden
  operational vs non-operational; Miryalaguda commissioned vs
  yet-to-commission; Gangakhed proposed vs under construction; Amravati
  50.5 vs 28 MLD proposed.
- **Telangana post-2022 status unknown** — newest MPR obtained is
  Jun–Aug 2022; its due dates (Dec 2022, Mar 2023) have passed with no
  newer source checked. MPR PDFs could not be downloaded via curl
  (nmcg.nic.in returns empty replies — browser fetch only) and were not
  saved locally; AP MPR not located; no CPCB inspection reports obtained.

## Corrections applied at assembly

- **12 rows dropped (244.45 MLD)** for 5 towns outside the Godavari
  basin, each verified against sources: Akola (3 rows, 108 MLD), Amravati
  (4, 102.5), Shegaon (2, 9), Washim (1, 8) — all on the Purna that is a
  Tapi tributary; Miryalaguda (2, 16.95) — on the Musi, a Krishna
  tributary. Pre-drop totals were 161 plants / 2,892.45 MLD.
- Town spelling normalised: Rajamahendravaram → Rajahmundry,
  Tryambakeshwar → Trimbakeshwar (to match people.csv).

Full per-plant audit trail: work/stps/stps_NOTES.md.
Build scripts: work/stps/build_godavari_stps.py,
work/stps/build_godavari_budgets.py, work/stps/geocode_godavari.py.
