# Cauvery towns — notes

## What this file is

41 towns along the Cauvery and its tributaries, with Census 2011 population,
literacy and sex ratio where published, and the current MLA (name, party,
constituency, election year) verified against the MyNeta (ADR) winners lists
for Karnataka 2023 and Tamil Nadu 2026.

## Coverage

- **41 towns: 17 Tier 1, 24 Tier 2.** Tier 1 = town centroid within the
  10 km corridor buffer. Tier 2 = outside the buffer but with an STP or drain
  row (the town matters to the river even though it is not on the bank).
- **Population 2011 for 40 of 41** (sum **16,103,461**). Poompuhar has no
  Census 2011 population found — blank, not zero.
- **MLA for all 41 towns.**
- **Featured towns:** Bengaluru, Mysuru, Erode, Tiruchirappalli.

## Bengaluru — why it is included

Bengaluru is 78.9 km from the centreline — the farthest town in the file —
but it is the single biggest source of pollution in the basin: its untreated
sewage flows down the Vrishabhavathi into the Arkavathi and then the Cauvery
(see `drains.csv`: 215 MLD estimated, 53.75 TPD, 2017 vintage). It is
included as a Tier 2 town for exactly that reason, and its distance is
stated on the row. The same logic applies to the other Tier 2 towns
(Coimbatore 91.3 km via the Noyyal; Mettupalayam 82.6 km via the Bhavani;
Tiruppur 50.6 km via the Noyyal; Salem 46.9 km via the Thirumanimutharu /
Sarabanga).

## Population corrections

Wikipedia infoboxes were not taken at face value. Where the infobox figure
was a later estimate or a different vintage, the 2011 figure was used
instead (full detail in `work/wiki_parsed.json` and the fix files):

- **Erode 521,776** — urban agglomeration; the infobox 157,101 is the
  pre-expansion municipality.
- **Karur 70,980** — pre-expansion; the infobox 394,719 is a 2023
  post-expansion estimate, NOT 2011.
- **Kumbakonam 140,156** — the infobox `as_of` reads 2021 but the figure is
  the 2011 census figure.
- **Hassan 177,484** — urban population; pre-expansion CMC 133,436; the
  infobox 300,000 is a 2025 estimate.
- **Kushalnagar 23,200** — the infobox 29,268 is a 2022 estimate.
- **Kodumudi 13,225** — Wikipedia 12,669 is the 2001 census figure.
- **Perundurai 15,500** — Wikipedia 16,973 is the 2001 census figure.
- **Mettupalayam 69,213** — the infobox 66,595 differs; 69,213 is the 2011
  figure from the town's census record.
- **Sathyamangalam 37,816** (literacy 72.02, sex ratio 1,006).
- **Srirangapatna 25,061** — the Karnataka MPR Jan 2025 says 25,069; the
  census figure is used.
- **Bannur 21,896** (literacy 70.75, sex ratio 1,018) — the Karnataka MPR
  Jan 2025 says 24,430; the census figure is used.
- **Kumarapalayam 71,594** — no dedicated Wikipedia article (resolved via
  "Komarapalayam"); population from the NGT order of 31 Jan 2022, which
  cites the 2011 census.
- **Srirangam excluded.** It merged into Tiruchirappalli Corporation in
  2011 and is covered by the Trichy row; its 181,556 figure is 2001, not
  2011.

## Coordinates

- Wikipedia article coordinates for 29 towns (`work/wiki_coords.json`);
  Nominatim geocoding for the rest (`work/geocode_cauvery.py`,
  `work/geocode_results.json`). Three geocode queries returned nothing:
  Harale, Yedkuri, Satyagala.
- **Kulithalai correction:** Wikipedia gives 10.56N 78.25E, which is ~40 km
  south of the river and contradicts the town's riverside position and the
  Musiri–Kulithalai bridge. The mindat.org locality record (10.93487,
  78.41251) is used instead — 1.79 km from the centreline (vs 10.51 km with
  the old point).
- **Musiri** uses Wikipedia 10.93, 78.45 (0.10 km from the centreline), not
  the Nominatim point 11.0488, 78.5282.
- **Bannur** 12.2548, 76.907 and **Hunsur** 12.3105671, 76.2802055 are from
  Wikipedia article coordinates — the Nominatim hits were a road in Mysuru
  and a different village, and were not used.
- **Satyagala discrepancy:** a separate search put "Satyagala" at
  12.3066474, 76.1383470, while the Satthegala GP in the Karnataka MPR is
  at 12.240843, 77.1412364. The WQ Satyagala Bridge row uses the MPR's
  Satthegala coordinates; see `wq_NOTES.md`.

## MLAs — verification

- **Karnataka 2023** and **Tamil Nadu 2026** (polling 23 Apr 2026, results
  4 May 2026; hung assembly: TVK 108, DMK 59, AIADMK 47, INC 5). Verified
  against the MyNeta (ADR) winners lists downloaded to
  `work/myneta_Karnataka2023.html` and `work/myneta_TamilNadu2026.html`,
  parsed to `work/myneta_winners.json`.
- **MyNeta table flaw:** every 9th row (serial numbers 9, 18, 27, …) is
  replaced by an obfuscated ad-script block in the downloaded HTML, so those
  seats are missing from a naive parse (Karnataka: 200 of 224 rows parsed;
  Tamil Nadu: 208 of 234 rows parsed). The script was not executed; the
  missing seats were verified by targeted searches instead. Missing from
  MyNeta and verified separately: Karnataka Maddur, Mandya, Periyapatna
  (spelled PIRIYAPATNA in MyNeta); Tamil Nadu Erode East, Kumbakonam,
  Mayiladuthurai, Rasipuram (as RASIPURAM(SC)).
- **No "Vacant" seats** among the Cauvery towns — earlier parse readings of
  "Vacant" for Karur, Tiruchirappalli East and Perundurai were parse
  artefacts.
- **Sathyamangalam town is in Bhavanisagar (SC)** — V.P. Tamilselvi, TVK.
  The Sathyamangalam Assembly constituency was abolished in the 2008
  delimitation and merged into Bhavanisagar. Do not confuse it with
  Senthamangalam (ST, Namakkal district, P. Chandrasekar, TVK), a different
  seat.
- **"T. Narasipur Assembly constituency"** is the correct title (not
  "T. Narasipura") — MLA Dr. H. C. Mahadevappa, INC, 2023. Bannur is also in
  T. Narasipur AC.
- Hassan: H.P. Swaroop, **JD(S)** (MyNeta; a BankBazaar list said INC —
  MyNeta used).

## Sources

- Wikipedia town articles (via the Wikipedia API; titles in
  `work/wiki_titles_cauvery.json`, raw fetch in `work/wiki_towns.json`,
  parsed in `work/wiki_parsed.json`) — population, literacy, sex ratio,
  coordinates. Census 2011 figures cross-checked against census2011.co.in
  where the infobox was ambiguous.
- MyNeta (Association for Democratic Reforms) winners lists, Karnataka 2023
  and Tamil Nadu 2026 — MLA name, party, constituency.
- NGT Southern Zone order, 31 Jan 2022 — Kumarapalayam population.
- mindat.org locality record — Kulithalai coordinates.

## Gaps and caveats

- **Poompuhar has no Census 2011 population.** No figure was found in any
  source used; the row is blank.
- **Livelihoods are qualitative only.** No worker-category split (cultivators
  / agricultural labourers / household industry / other workers) was compiled.
- **No religion shares and no 20-year ruling history** were compiled — no
  real source was found in the time available; they are not in this file.
- **Provenance columns:** following the Sabarmati template, `people.csv`
  has no `source` / `as_of` columns. Provenance is carried in
  `population_basis`, `mla_source`, `data_vintage` and `coord_source` on
  each row.
- **KR Nagar and Madikeri are not town rows** — they appear only as STP
  towns, plotted at the T Narasipura and Kushalnagar centroids respectively
  (see `stps_NOTES.md`).
- The summed town population (16,103,461) is NOT the corridor population —
  see `population_NOTES.md`. It includes Bengaluru (8,443,675) and Coimbatore
  (1,601,438), both far outside the 10 km buffer.
