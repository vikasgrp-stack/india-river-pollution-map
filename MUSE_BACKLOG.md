# Muse Backlog — India River Pollution Map

Shared working file for the two Muse accounts working on this repo.
This file is the handoff between them. Read it at the start of a session
and update it before you finish.

## Who is who

Sign every entry with your identifier and a date, so we know who said what.
Do not use the GitHub login to tell us apart — commits are all made as
`vikasgrp-stack`.

- **vikas.singh.76** — this Muse account (the one that created this file)
- **vikas.grp** — the other Muse account (works on this repo most days;
  out of tokens until Wed 2026-12-02, 09:22 PT, then resumes)

Rules:
- Read this file first, then check the repo for anything newer than it.
- Claim a task before you start it: move it to In Progress with your
  identifier and the date. Do not start a task someone else has claimed
  unless they mark it blocked or done.
- Append to the Log at the bottom. Never delete another account's entries.
- Keep the backlog honest: if data is not published, say so in the site
  and here — do not guess a number.
- Ask the user (not the other Muse) for decisions about scope, a new
  river, or publishing.

## Current state — as studied 2026-11-27 by vikas.singh.76

Repo: `vikasgrp-stack/india-river-pollution-map` — public, static site,
no build step, no backend, no API keys. Leaflet map, Esri World Imagery
satellite + OpenStreetMap streets. Deployed on Vercel at
india-river-pollution-map.vercel.app.

Views: Map, Action list (top 30 problems, worst first), Data, charts
& sources. Layers: drains, STPs, water-quality stations, towns,
industries, drain courses, corridor buffer. Town search, Near me,
mobile layout, visual legend. Data is government sources only where
they exist (CPCB, NMCG, Ganga Knowledge Portal, Election Commission,
Census of India, state boards), with the source shown next to every
number.

Rivers live (5), all added 2026-11-27 in 14 commits, last commit
`6352a7bf` — Godavari:
- Ganga — 609 drains, 145 STPs (+6 commissioned 2024-2026),
  115 water-quality stations, 493 towns. STP locations: 33 of 151
  plants now satellite-verified (Prayagraj, Varanasi, Kanpur, Patna,
  Haridwar), merged 2026-11-27 in PR #1 (merge commit `739023c1`,
  vikas.singh.76).
- Yamuna — 50 drains, 115 STPs, 35 stations, 45 towns
- Sabarmati — added 2026-11-27; counts not in README, verify in
  `data/sabarmati/analysis.json`
- Cauvery — 14 drains, 68 STPs, 22 stations, 41 towns
- Godavari — 97 drains, 149 STPs, 86 stations, 87 towns

No open issues. No LICENSE, tests, or data-validation script in the repo.

## Backlog

### P0 — do first
- [x] Fix Ganga STP locations: satellite-verify the plants that were
  plotted at town centroids. Done 2026-11-27 by vikas.singh.76 —
  33 plants located on 24 sites (Prayagraj 8, Varanasi 6, Kanpur 6,
  Patna 8, Haridwar 5), 2 unconfirmed (Phaphamau 14 MLD, Jhunsi
  16 MLD — left at town-centroid, no coordinate invented). Branch
  `vikas.singh.76/ganga-stp-locations`, PR #1 merged 2026-11-27
  (merge commit `739023c1`).
  Files: `data/ganga/stp_accountability.geojson` +
  `data/ganga/stp_accountability.csv`, `coord_accuracy` set to
  `satellite-verified` with `coord_source` + `coord_confidence`.
- [ ] Update README.md to 5 rivers with counts for each. It still says
  Ganga + Yamuna only. — unclaimed
- [ ] Verify the live Vercel site loads all 5 rivers, the Data tab,
  and the Action list, and note the result + date here. — unclaimed
- [ ] Add a data-validation check (script or checklist): string
  booleans "True"/"False"/"", every row has `source` + `as_of`,
  row counts match `analysis.json`. This bug already bit once
  (action list lost 12 STP rows). — unclaimed

### P1 — location audit, all layers (user expanded scope 2026-11-27:
  fix all locations, not just STPs)
- [ ] Water-quality stations (Ganga first): 115 features, 110 Point,
  5 null geometry, 68 distinct coords. Stations are geocoded to a
  place name, not the exact river station. Verify against the river
  / ghat / bridge named in the source. — unclaimed
- [ ] Drains (Ganga): 609 Point, 603 distinct coords, no
  `coord_accuracy` field. Audit whether each point is a true outfall
  or a town offset. — unclaimed
- [ ] Industries (Ganga): 25 Point, `coord_status` = approximate,
  plotted at town / in an area. Find exact sites where published. — unclaimed
- [x] Nashik / Godavari STPs: satellite-verified 2026-11-27 by
  vikas.singh.76 and applied in this PR with the Nagpur plants
  (branch `vikas.singh.76/godavari-stp-locations`, PR open, not
  merged). Nashik: 10 of 15 plants moved, on 5 sites (Tapovan,
  Chehedi, Panchak, Agar Takali, Gangapur). NOT moved: Pimpalgaon
  Baswant 32 MLD (never verified, no site found) and the 4 Kumbh
  2027 plants (Tapovan 180, Agartakli 97, Chehedi 64, Panchak 75 —
  under construction, do not move to operating-plant footprints).
  Nagpur: 5 of 12 moved (Bhandewadi 200 + 130, Somalwada-1/2,
  Kachimet); Sonegaon 0.3 MLD held (LOW confidence) and 6 plants
  unconfirmed (Mankapur, Mokshadham, Hazari Pahad, Ambazari, Dabha,
  Ittabhatti — left at town-centroid). Somalwada -1/-2 split is NOT
  verified from maps and could be swapped (both MEDIUM).

### P1 — data gaps
- [ ] Godavari: no CPCB drain inventory. 95 of 97 drains unmeasured.
  Research whether a per-drain BOD list exists; if not, keep the
  gap stated on the site. — unclaimed
- [ ] Godavari STPs: 123 of 149 not assessed for NGT norms; no
  per-plant TN or faecal coliform value published anywhere.
  Find a source or keep it marked not published. — unclaimed
- [ ] Godavari budgets: 130 of 149 plants undisclosed; funds
  released/utilised disclosed for 0 of 149. Same check for the
  other rivers. — unclaimed
- [ ] Godavari drain courses: 0 — no published drain geometry.
  Check the other rivers and list which have geometry. — unclaimed
- [ ] Water quality: trends are snapshots, not a continuous series
  (Godavari: 5 improving, 2 worsening, 79 stable, only Telangana
  has two comparable monthly points). Find a series where one
  exists, or label it clearly as snapshots. — unclaimed

### P1 — next river
- [ ] Add the next river. Ask the user which one first:
  Narmada, Krishna, Brahmaputra, Tapi, Mahanadi are the obvious
  candidates. Follow the same schema as Godavari/Cauvery
  (drains, STPs, WQ, towns, budgets, industries, NOTES files,
  COVERAGE_AND_GAPS.md). — unclaimed

### P2 — polish
- [ ] Add a LICENSE and a short contributing note for this file. — unclaimed
- [ ] Check performance and mobile: app.js is ~136 KB, repo ~6.7 MB;
  test load on a phone and on a slow connection. — unclaimed
- [ ] Accessibility pass: keyboard, screen-reader labels on the
  map controls, colour-only legend. — unclaimed
- [ ] Verify Sabarmati counts and update the Current state section
  above with them. — unclaimed

### Ideas / parked
- Share / embed view for a single town or river stretch.
- Multilingual labels for town names.
- A "last updated" date on each river's Data tab, from its data files.

## In Progress

- Godavari STP locations (vikas.singh.76, 2026-11-27): Nashik +
  Nagpur corrections done and in PR from branch
  `vikas.singh.76/godavari-stp-locations` — do not start a second
  STP-location edit until that PR merges. Ganga PR #1 is merged.

## Open questions for the user

- Which river next: Narmada, Krishna, Brahmaputra, Tapi, or Mahanadi?
- Is the 10 km corridor the right buffer for every river, or should
  it vary by river?
- Should the site name the worst towns / plants by name on the
  Action list, as it already does for Meerut on the Ganga?

## Log

- 2026-11-27 — vikas.singh.76: Created this file. Studied the repo
  (14 commits on 2026-11-27, 5 rivers, README out of date, gaps
  listed above). Did not run or build the site locally. Other
  account (vikas.grp) is out of tokens until 2026-12-02 09:22 PT.
- 2026-11-27 — vikas.singh.76: Fixed Ganga STP locations (user: Ganga
  first). Satellite-verified 33 plants on 24 sites — Prayagraj 8,
  Varanasi 6, Kanpur 6, Patna 8, Haridwar 5 — in
  `data/ganga/stp_accountability.geojson` + `.csv`, in lockstep,
  `coord_accuracy` = `satellite-verified`, with `coord_source` and
  `coord_confidence` (HIGH/MEDIUM). 2 unconfirmed, no coordinate
  invented: Phaphamau 14 MLD, Jhunsi 16 MLD (left at town-centroid).
  Dinapur uses satellite centre 25.3472, 83.0470 (Google pins are
  400-900 m off); Kankarbagh 30 MLD sits at the Pahari site per NMCG
  (MEDIUM); Sarai 18 MLD is MEDIUM (could be a leachate unit).
  Branch `vikas.singh.76/ganga-stp-locations`, PR open, not merged.
  Nashik/Godavari corrections (5 sites) verified the same day but
  held for a separate PR after this one. Next step: water-quality
  stations, then drains, then industries (user expanded scope to
  all locations).
- 2026-11-27 — vikas.singh.76: Fixed Godavari STP locations
  (Nashik + Nagpur), after Ganga PR #1 merged (merge commit
  `739023c1`). 15 plants moved to 10 sites in
  `data/godavari/stps.geojson` + `stps.csv`, in lockstep,
  `coord_accuracy` = `satellite-verified`, with `coord_source` and
  `coord_confidence` (HIGH/MEDIUM). Nashik 10/15: Tapovan 78+52,
  Chehedi 22+21, Panchak 7.5+21+32, Agar Takali 70+40 (HIGH),
  Gangapur 18 (MEDIUM). Nagpur 5/12: Bhandewadi 200 + 130 (HIGH),
  Somalwada-1 east unit + Somalwada-2 west unit (MEDIUM — the -1/-2
  split is NOT verified from maps and could be swapped), Kachimet 1
  (MEDIUM). NOT moved: Nashik Pimpalgaon Baswant 32 MLD (never
  verified) and the 4 Kumbh 2027 plants (do not move to
  operating-plant footprints); Nagpur Sonegaon 0.3 MLD (LOW
  confidence, pin in housing, no visible footprint — needs ground
  check) and 6 unconfirmed (Mankapur, Mokshadham, Hazari Pahad,
  Ambazari, Dabha, Ittabhatti). Hingna footprint 21.1205224,
  78.9744285 not assigned to any plant; Gorewada Rd water-treatment
  plant and generic Nagpur STP pin 21.1392632, 79.152384 not used.
  Note: the working notes said "Nashik 15/15" and "21 plants" in
  total, but only 10 Nashik + 5 Nagpur plants match a verified site,
  so 15 moved — the rest stay at town-centroid, no coordinate
  invented. Distinct Godavari STP coords 63 -> 73. Branch
  `vikas.singh.76/godavari-stp-locations`, PR open, not merged.
