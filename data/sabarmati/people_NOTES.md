# Sabarmati towns (people) — notes

## What this file is

12 towns and villages along the Sabarmati, with Census 2011 population and
the current MLA (as of November 2026). Populations are Census 2011 unless
stated; MLAs are from the Gujarat 2022 assembly election (one 2024
by-election — see Khambhat).

## Inclusion tiers

- **Tier 1 (9 towns)** — town centroid within the 10 km corridor buffer:
  Ahmedabad, Gandhinagar, Kheroj, Mahudi, Chiloda, Prantij, Miroli, Dholka,
  Vautha.
- **Tier 2 (3 towns)** — outside the buffer but kept for a stated reason:
  - **Himmatnagar** (12.2 km outside) — its 17.51 MLD STP is in the dataset;
    the town sits on the Hathmati, a left-bank tributary of the Sabarmati.
  - **Sanand** (14.9 km outside) — its 20.50 MLD STP is in the CPCB
    inventory. Its discharge path to the Sabarmati is not published.
  - **Khambhat** (22.7 km from the end of the OSM centreline) — the
    river-mouth town on the Gulf of Khambhat. No STP or drain row for
    Khambhat.
- **Excluded**: **Kherwara, Rajasthan** (61.5 km from the main stem) — it
  sits on the Wakal tributary system, not the Sabarmati main stem (the Wakal
  joins the Sabarmati near Kotra, ~60 km downstream of Kherwara town), and
  has no drain or STP on the main stem.

## Population corrections (Wikipedia infobox errors found and fixed)

- **Dholka**: the Wikipedia infobox figure of 250,000 is the **taluka**
  population (249,852), not the town. Correct town figure (M + OG):
  **80,945** (Census 2011; citypopulation.de, censusindia2011.com and
  populationindia.com all agree). Literacy 72.21%, sex ratio 932.
- **Gandhinagar**: the Wikipedia infobox figure of 292,167 was corrected to
  **292,797** (District Census Handbook, Gandhinagar, Gandhinagar NA + OG;
  citypopulation.de and CEIC agree). The city-proper (NA only) figure is
  ~206,167–208,299 in different compilations; the NA + OG total is used, with
  the basis stated, matching the Yamuna convention.
- **Khambhat**: the Wikipedia infobox area of 2,932.9 sq km is the **taluka**
  area, not the town. Area and density are left blank rather than publish a
  wrong figure.
- **Villages** (Census 2011 village directories): Mahudi 5,343 (lit 71.46%,
  sex ratio 904); Miroli 3,257 (lit 65.86%, sex ratio 928); Vautha 2,056;
  Kheroj 1,244.
- **Chiloda (Mota Chiloda)**: no published Census 2011 population was found
  for this village. Population is left blank with a note.

## MLAs — all 12 verified

Sources: MyNeta (Association for Democratic Reforms) Gujarat 2022 winners
list (`raw/myneta_gujarat2022.html`); where the parsed MyNeta table missed a
row, the MLA was verified from the live MyNeta winners list or the
Wikipedia assembly-constituency article (ECI results).

- Himmatnagar — Vinendrasinh Dilipsinh Zala, BJP, 2022 (MyNeta).
- Prantij — Gajendrasinh Udesinh Parmar, BJP, 2022 (MyNeta).
- Gandhinagar North — Ritaben Ketankumar Patel, BJP, 2022 (Wikipedia, ECI
  results; absent from the parsed MyNeta table).
- Gandhinagar South — Alpesh Khodaji Thakor, BJP, 2022 (MyNeta). Chiloda
  (Mota Chiloda) falls in this constituency per the delimitation segment
  list.
- Ahmedabad — Amit Shah, BJP, 2022, Ellisbridge (MyNeta). Ahmedabad has 21
  assembly seats; Ellisbridge is the city-centre seat used here, as Agra's
  city-centre seat was used for the Yamuna.
- Sanand — Kanubhai Karamshibhai Patel, BJP, 2022 (MyNeta).
- Dholka — Kiritsinh Sardarsang Dabhi, BJP, 2022 (Wikipedia, ECI results;
  absent from the parsed MyNeta table). Vautha is in Dholka taluka, so the
  same MLA is listed for Vautha.
- Mahudi — Jayantibhai Somabhai Patel (J.S. Patel), BJP, 2022, Mansa
  (MyNeta).
- Miroli — Babubhai Jamnadas Patel, BJP, 2022, Daskroi (Wikipedia, ECI
  results; absent from the parsed MyNeta table).
- Kheroj — Dr. Tushar Amarsinh Chaudhary, INC, 2022, Khedbrahma (ST)
  (Wikipedia, ECI results; absent from the parsed MyNeta table).
- Khambhat — Chiragkumar Arvindbhai Patel, **BJP, elected 2024 by-election**.
  He won the seat for the INC in 2022 (69,069 votes), resigned from Congress
  on 19 Dec 2023, joined the BJP and won the 2024 by-election on a BJP
  ticket (88,457 votes). Recorded as BJP, election year 2024.

## Gaps

- **No religion shares and no 20-year ruling history** for any Sabarmati
  town — the same "not compiled" convention as the Yamuna towns. Only the
  current MLA is recorded.
- **Livelihoods are qualitative only** — no worker-category split (Census
  2011 B-series) was compiled for Sabarmati towns.
- **No urban/rural split** compiled per town (urban_pct / rural_pct blank).
- **Chiloda population missing** (see above).
- Kherwara's MLA (Dr. Dayaram Parmar, INC, 2023, Kherwara AC, Rajasthan) was
  verified but is not in the file because the town is excluded.
