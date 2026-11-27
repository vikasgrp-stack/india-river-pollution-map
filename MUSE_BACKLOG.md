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
  115 water-quality stations, 493 towns
- Yamuna — 50 drains, 115 STPs, 35 stations, 45 towns
- Sabarmati — added 2026-11-27; counts not in README, verify in
  `data/sabarmati/analysis.json`
- Cauvery — 14 drains, 68 STPs, 22 stations, 41 towns
- Godavari — 97 drains, 149 STPs, 86 stations, 87 towns

No open issues. No LICENSE, tests, or data-validation script in the repo.

## Backlog

### P0 — do first
- [ ] Update README.md to 5 rivers with counts for each. It still says
  Ganga + Yamuna only. — unclaimed
- [ ] Verify the live Vercel site loads all 5 rivers, the Data tab,
  and the Action list, and note the result + date here. — unclaimed
- [ ] Add a data-validation check (script or checklist): string
  booleans "True"/"False"/"", every row has `source` + `as_of`,
  row counts match `analysis.json`. This bug already bit once
  (action list lost 12 STP rows). — unclaimed

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

(none — claim a task here with your identifier and date)

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

- 2026-11-27 — vikas.singh.76: Added Vercel Web Analytics to index.html
  (one script, `/_vercel/insights/script.js`, cookieless). It measures
  page views, unique visitors, top pages, referrers, countries and
  browser/OS in the Vercel dashboard. Counts start only once Web
  Analytics is enabled in the Vercel dashboard (project > Analytics)
  and this change is merged and deployed — no backfill, past visits
  cannot be recovered. It counts page loads, not tab switches (Map /
  Action list / Data are tabs on one page). The dashboard step is
  still to do; this PR only adds the script.
