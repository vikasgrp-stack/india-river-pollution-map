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
- **s.advitya** — this Muse account (joined 2026-11-27; research:
  webcams / live panel, Varanasi people contacts, satellite AI
  insights — satellite / aarti scope paused, see Log)

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

Rivers live (5), all added 2026-11-27 in 28 commits, last commit
`7cc0b56` — Godavari:
- Ganga — 609 drains, 145 STPs (+6 commissioned 2024-2026),
  115 water-quality stations, 493 towns. STP locations: 33 of 151
  plants now satellite-verified (Prayagraj, Varanasi, Kanpur, Patna,
  Haridwar), merged 2026-11-27 in PR #1 (merge commit `739023c1`,
  vikas.singh.76).
- Yamuna — 50 drains, 115 STPs, 35 stations, 45 towns
- Sabarmati — added 2026-11-27; 11 drains, 24 STPs, 10 water-quality
  stations, 12 towns (from `data/sabarmati/analysis.json`, verified
  2026-11-27 by s.advitya; not yet cross-checked against GeoJSON
  row counts)
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
- [x] Update README.md to 5 rivers with counts for each. It still says
  Ganga + Yamuna only. — done 2026-11-27 by s.advitya: new heading
  "India River Pollution Map", 5 rivers with counts (Ganga 609 / 145 /
  115 / 493; Yamuna 50 / 115 / 35 / 45; Sabarmati 11 / 24 / 10 / 12;
  Cauvery 14 / 68 / 22 / 41; Godavari 97 / 149 / 86 / 87). Branch
  `s.advitya/readme-5-rivers`.
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
  or a town offset. — claimed by s.advitya, 2026-11-28. Triage done
  (see Log): 249 main-stem drains <500 m from the river, 77 >1 km,
  52 >2 km; 199 tributary drains need tributary lines. Pilot
  satellite checks done for 5 drains (Varanasi, Kanpur, Unnao);
  no coordinates moved yet. Working note:
  `data/ganga/drains_audit_NOTES.md`.
- [ ] Industries (Ganga): 25 Point, `coord_status` = approximate,
  plotted at town / in an area. Find exact sites where published. — unclaimed
- [x] Nashik / Godavari STPs: satellite-verified 2026-11-27 by
  vikas.singh.76 and applied in this PR with the Nagpur plants
  (branch `vikas.singh.76/godavari-stp-locations`, PR #3 merged
  2026-11-27, merge commit `a8b69d2b`). Nashik: 10 of 15 plants moved, on 5 sites (Tapovan,
  Chehedi, Panchak, Agar Takali, Gangapur). NOT moved: Pimpalgaon
  Baswant 32 MLD (never verified, no site found) and the 4 Kumbh
  2027 plants (Tapovan 180, Agartakli 97, Chehedi 64, Panchak 75 —
  under construction, do not move to operating-plant footprints).
  Nagpur: 5 of 12 moved (Bhandewadi 200 + 130, Somalwada-1/2,
  Kachimet); Sonegaon 0.3 MLD held (LOW confidence) and 6 plants
  unconfirmed (Mankapur, Mokshadham, Hazari Pahad, Ambazari, Dabha,
  Ittabhatti — left at town-centroid). Somalwada -1/-2 split is NOT
  verified from maps and could be swapped (both MEDIUM).

### P1 — s.advitya: live panel, people contacts, live data
- [x] Add a "Watch live (when on)" link-out panel: 8 items, aarti
  hours only, offline fallback, no hard-coded 24/7 embed. Needs a
  weekly link check — YouTube IDs churn in days. — done 2026-11-27
  by s.advitya: new top tab "Watch live (when on)", data in
  `data/live_panel.json`, rendered from that file in `app.js`
  (`renderLivePanel()`), with the CPCB RTWQMS + GangaPulse links
  and the Manikarnika exclusion in the tab. Branch
  `s.advitya/live-panel`.
- [ ] Add a CPCB RTWQMS live-data layer (~40 stations, hourly) +
  GangaPulse STP layer, cached as a daily snapshot in the repo — do
  not depend on the government server at page load. Note: RTWQMS
  dashboard load was NOT verified live; the 40-station figure rests
  on a Parliament answer, 16 Mar 2026. — claimed by s.advitya,
  2026-11-27 (proposed next after the live panel)
- [ ] Add Varanasi people-cards + "Report a problem" data to the map
  as a pilot, linked to the drains / STPs / stations each role
  covers — then judge whether to extend to other towns. Research
  done 2026-11-27 (see Log); map integration not yet started. —
  claimed by s.advitya, 2026-11-27

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
- [x] Detail cards: prominent type label at the top of every card
  (Drain / Sewage treatment plant / Water-quality monitoring
  station / Drain course / Industry / Town) with a one-line
  plain-English description, plus an accurate STP location line
  (satellite-verified vs town centroid) and corrected
  town-centroid copy for Ganga + Godavari. Done 2026-11-27 by
  vikas.singh.76 — branch `vikas.singh.76/detail-type-label`,
  PR #4 merged 2026-11-27 (merge commit `a3c972dc`). Yamuna /
  Sabarmati / Cauvery copy untouched (still true). Known follow-up,
  not fixed here: the header count "146 of 145 plants"
  inconsistency noted in the live test.
- [ ] Add a LICENSE and a short contributing note for this file. — unclaimed
- [ ] Check performance and mobile: app.js is ~136 KB, repo ~6.7 MB;
  test load on a phone and on a slow connection. — unclaimed
- [ ] Accessibility pass: keyboard, screen-reader labels on the
  map controls, colour-only legend. — unclaimed
- [x] Verify Sabarmati counts and update the Current state section
  above with them. — done 2026-11-27 by s.advitya: 11 drains,
  24 STPs, 10 water-quality stations, 12 towns, from
  `data/sabarmati/analysis.json` (not yet cross-checked against
  GeoJSON row counts).

### Ideas / parked
- Share / embed view for a single town or river stretch.
- Multilingual labels for town names.
- A "last updated" date on each river's Data tab, from its data files.

## In Progress

- Style polish — professional look + easier navigation (vikas.singh.76,
  2026-11-27): stats strip under the tabs, shorter tab labels, one-line
  map orientation, grouped map controls (Find / Show / Basemap), sticky
  detail-card header, severity tint on the Action list, in-page nav on
  the Data tab, Inter + Source Serif 4 typography, 36px touch targets,
  split footer. Branch `vikas.singh.76/style-polish`.

- Ganga drains location audit (s.advitya, 2026-11-28): verify each
  of the 609 drains against its receiving watercourse and move pins
  to true outfalls where visible on satellite; worst first
  (main-stem drains >2 km from the river, 52). Branch
  `s.advitya/ganga-drains-audit`.

- Log both s.advitya research entries in MUSE_BACKLOG.md (s.advitya,
  2026-11-27): webcams / live panel + Varanasi people contacts.
  Branch `s.advitya/backlog-2026-11-27`.

- Log both s.advitya research entries in MUSE_BACKLOG.md (s.advitya,
  2026-11-27): webcams / live panel + Varanasi people contacts.
  Branch `s.advitya/backlog-2026-11-27`.

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
  Branch `vikas.singh.76/ganga-stp-locations`, PR #1 merged
  2026-11-27 (merge commit `739023c1`). Nashik/Godavari
  corrections (5 sites) verified the same day but held for a
  separate PR after this one. Next step: water-quality stations,
  then drains, then industries (user expanded scope to all
  locations).
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
  `vikas.singh.76/godavari-stp-locations`, PR #3 merged 2026-11-27
  (merge commit `a8b69d2b`).
- 2026-11-27 — vikas.singh.76: Vercel Web Analytics added (user
  asked for unique-user / visit counts). One script in `index.html`
  only (+5 lines, `window.va` stub + `<script defer
  src="/_vercel/insights/script.js">`); no other tracker. Branch
  `vikas.singh.76/vercel-analytics`, PR #2 merged 2026-11-27
  (merge commit `21231810`). The script does nothing until Web
  Analytics is enabled in the Vercel dashboard (project >
  Analytics) — user still needs to do that step. Counts start from
  enablement, no backfill. Dashboard shows country only (per
  Vercel docs), no per-visitor list, no IP stored.
- 2026-11-27 — vikas.singh.76: Detail cards now say what they are.
  Every card opens with a prominent type chip (Drain / Sewage
  treatment plant / Water-quality monitoring station / Drain
  course / Industry / Town, each with its own colour and a
  one-line plain-English description), implemented in `app.js`
  (`typeChip()` in all six `show*` functions) with a new
  `.type-chip` style in `styles.css`. The STP card footer that
  falsely claimed all plant locations are town centroids is
  replaced by a location line driven by `coord_accuracy`:
  satellite-verified plants show a green badge + confidence +
  coordinates; the rest show a grey "Town centroid — approximate
  location" badge. Coordinates come from `latitude`/`longitude`
  (Ganga) or are wired through from the feature geometry as
  `_lat`/`_lon` at both call sites (Godavari properties carry no
  lat/lon). No coordinates invented — unverified plants keep
  town-centroid. Legend note and Ganga + Godavari Data-tab copy
  corrected to the truth (33 of 151 Ganga, 15 of 149 Godavari
  satellite-verified); Yamuna / Sabarmati / Cauvery copy untouched.
  Branch `vikas.singh.76/detail-type-label`, PR #4 merged
  2026-11-27 (merge commit `a3c972dc`). Known follow-up, not
  fixed here: the "146 of 145 plants" header-count inconsistency
  noted in the live test.
- 2026-11-27 — vikas.singh.76: Analytics script switched to
  Vercel's CDN endpoint. One line in `index.html`: the script src
  goes from `/_vercel/insights/script.js` to
  `https://cdn.vercel-insights.com/v1/script.js` (Vercel's official
  v2 script, verified against Vercel's own docs and by fetching
  the script). The old path 404s until Web Analytics is enabled
  in the dashboard; the CDN script loads regardless. Data still
  flows only after the dashboard enablement (user is handling
  that separately). This replicates the Vercel bot's PR #5, which
  is still a draft and cannot be merged — this PR supersedes it.
  Branch `vikas.singh.76/vercel-analytics-cdn`.

- 2026-11-27 — s.advitya: Webcam research for all 5 rivers, 23
  candidates checked. Headline: no open, 24/7, embeddable riverfront
  webcam network exists. What exists is scheduled YouTube aarti /
  darshan streams (event-only, new video ID each time). Do NOT build
  the map around live video. Verified dead / misleading: VizCams
  Haridwar — badged LIVE, Play returned "This video is unavailable";
  VizCams Delhi is a night city view, not the Yamuna; VizCams
  Ahmedabad offline. No usable river cam found for Sabarmati
  Riverfront, Cauvery (Srirangam / Trichy / Mysuru / Coorg),
  Prayagraj Sangam, Kanpur, Delhi Yamuna, Rajahmundry, or Assi Ghat.
  Exclusion: Manikarnika Ghat — photography / filming of cremations
  is strictly prohibited; leave out of any visual layer. Full report
  in the research page (India River Webcams Research). Proposed
  next: an 8-item "Watch live (when on)" link-out panel — aarti
  hours only, with offline fallback; no hard-coded 24/7 embed
  (data: `live-panel.json`, needs a weekly link check); a CPCB
  RTWQMS live-data layer (~40 stations, hourly) + GangaPulse STP
  layer, cached as a daily snapshot — do not depend on the
  government server at page load (RTWQMS dashboard load NOT
  verified live; 40-station figure from a Parliament answer,
  16 Mar 2026); longer term only, partner with a trust /
  municipality at 1-2 towns to host a real camera and publish it
  to Windy — needs written permission. Privacy guardrails: official
  streams only, youtube-nocookie embeds, link-outs preferred; no
  recording / archiving, no face recognition, no Manikarnika; add
  a takedown contact. (Not legal advice — DPDP Act 2023.) Note:
  the draft correction about PR #1 being described as open in the
  backlog is moot — the backlog itself now records PR #1 merged
  2026-11-27 (merge commit `739023c1`).
- 2026-11-27 — s.advitya: Varanasi people contacts (pilot).
  Public, official contacts only, checked 2026-11-27. Top 6 cards
  to show first: UPPCB Regional Officer Varanasi (Avas Vikas
  Complex, Bhelupur; 0542-2275951; rovaranasi@uppcb.in — office
  only, holder name conflicts across 2024-26 sources, do not
  publish a name); District Magistrate Varanasi, Chair District
  Ganga Committee (Satyendra Kumar, IAS; 0542-2508585;
  dmvar@nic.in); Varanasi Nagar Nigam Commissioner / helpline
  1533 (1800-180-5567); NMCG Director General (Rajeev Kumar
  Mital; 011-23049528; dg@nmcg.nic.in); SMCG-UP Project Director
  (0522-2838106; pd@smcgup.org) + Varanasi DPO Aishwarya Mishra
  (dgcvns111@gmail.com, as published); Sankat Mochan Foundation
  (+91-542-2313884, Tulsi Ghat lab since 1993 — the only
  Varanasi-based citizen monitor with a published contact). No
  CPCB office in Varanasi itself — Lucknow Regional Directorate
  covers it (rdlucknow.cpcb@gov.in). STPs: 6 sites / 7 units,
  420 MLD total — Dinapur 140 + 80, Goithaha 120, Ramna 50,
  Ramnagar 10, Bhagwanpur 8, BLW 12. No public contact for any
  individual STP. JJM dashboard Nov 2026: Dinapur 140 and
  Ramnagar 10 listed non-operational due to flood; BLW 12
  non-compliant — treat status as "check live dashboard".
  Ghat / aarti bodies: Ganga Seva Nidhi (Dashashwamedh aarti)
  and Shri Kashi Vishwanath Temple Trust. Manikarnika excluded
  from any visual layer. Researchers (institution only): 2024
  Sentinel-2 Varanasi study team, IIT (BHU) Civil Engineering —
  Mishra, Ohri, Singh, Gaur, Bhattacharjee; no private contact
  details. Grievance channels, as a top-level "Report a problem"
  tab per John's instruction 2026-11-27: CPGRAMS (India-wide,
  pgportal.gov.in); Jansunwai / CM Helpline 1076 (UP state-wide);
  CPCB SAMEER app; JJM 1800-121-2164 (sewerage / STPs); VNN
  helpline 1533; NGT e-filing as escalation only (standing Ganga
  matter OA 200/2014). Plus the evidence checklist: exact
  location + drain / STP name, date / time, 2-3 geo-tagged
  photos, CPCB reading if available. GangaPulse is a
  vendor-operated STP dashboard, NOT a complaint channel — do
  not present its vendor support line as a grievance route.
  Gaps — no public contact found (say so on the map, do not
  guess): individual STPs; named VNN drains / sewerage officer;
  Jal Kal / Varanasi Jal Sansthan (its website returned unrelated
  content 2026-11-27); NMCG Varanasi project office; UPPCB RO
  named holder. 55 MLD Bhagwanpur STP, due 6 Dec 2025 — no
  post-Dec-2025 completion status found. Maintenance warning:
  names change fast — VNN Commissioner changed mid-Nov 2026
  (Shashwat Tripurari). Cards must show role + office contact,
  name "as of Nov 2026", with a re-check date. Research page:
  Varanasi People Contacts. Proposed next: add the
  people-cards + "Report a problem" data to the map as a pilot
  for Varanasi only, linked to the drains / STPs / stations each
  role covers; next research, if the user wants it: state
  grievance portals for the other four rivers, so "Report a
  problem" works beyond UP. Satellite scope and aarti layer
  options A / B / C remain paused per John's 2026-11-27
  "keep your research saved, we need to think more" — not
  decided here.

- 2026-11-27 — s.advitya: README updated to 5 rivers. Heading was
  "Ganga + Yamuna River Pollution Map" and the Data section listed
  only Ganga and Yamuna; it now says "India River Pollution Map",
  five rivers on one page with a river switcher, and lists counts
  for all five (see the P0 item above). Stack / Run locally /
  Deploy unchanged. Branch `s.advitya/readme-5-rivers`.

- 2026-11-27 — s.advitya: "Watch live (when on)" panel added as a
  top tab on the site. New tab + `liveView` section in `index.html`;
  `switchTab()` in `app.js` now includes 'live' and renders the
  panel lazily from `data/live_panel.json` (`renderLivePanel()`,
  with a download fallback if the fetch fails). The 8 items are
  link-outs only, aarti hours only — no 24/7 embed, no hard-coded
  video that rots; each item shows town, river, viewpoint, hours
  (IST), kind and reliability. The tab also lists where no live
  camera was found (Sabarmati Riverfront, Cauvery, Prayagraj
  Sangam, Kanpur, Delhi Yamuna, Rajahmundry, Assi Ghat) and the
  live-data alternative: CPCB RTWQMS (~40 stations, hourly;
  dashboard load not verified live, figure from a Parliament
  answer, 16 Mar 2026) and GangaPulse. Manikarnika excluded.
  Validation: `node --check app.js` passes, `live_panel.json`
  is valid JSON, `index.html` parses. Needs a weekly link check —
  YouTube IDs churn in days. Branch `s.advitya/live-panel`.

- 2026-11-27 — vikas.singh.76: Style polish, the full set the user
  asked for (8 suggestions). Stats strip under the tabs replaces the
  old header-counts sentence: four big-number blocks (drains,
  plants plotted of total, stations plotted of total, towns) fed by
  `updateHeaderCounts()` — it reads the same variables, so the
  counts fix in open PR #11 flows into the strip with no extra
  work; the strip is visible on phones too (2×2 grid). Tabs
  shortened to Map / Action list / Data & sources / Watch live
  (page headings keep the full wording). Map panel gets a one-line
  orientation ("Every drain, treatment plant and water-quality
  reading on India's rivers. Tap any marker…") and grouped
  controls — Find a place (search + Fit map + Near me), Show on
  the map (layer chips + shortcomings + legends), Basemap; the
  river filter stays in the title row so it stays visible on a
  collapsed phone panel. Detail cards get a sticky header (type
  chip + title pinned while the card scrolls, `.card-head` wrapper
  in all six `show*` functions, close button raised above it).
  Action list rows get a severity tint (red / amber / slate left
  border, relative to the biggest in their group) and a larger
  headline figure. Data tab gets a sticky in-page nav with anchor
  links to all eight sections (`scroll-margin-top` so headings
  are not hidden under it). Typography: Inter for UI, Source Serif
  4 for headings and big numbers (one Google Fonts link, no build
  step), base 15px -> 16px; chips, buttons and locate buttons get
  a 36px minimum height. Footer split into two short lines +
  "Content compiled November 2026". The map height calc subtracts
  the strip (desktop 55px, mobile 100px) — verify on the preview
  that the page does not scroll on the Map tab. No data files
  touched; `node --check app.js` passes; `index.html` parses.
  Branch `vikas.singh.76/style-polish`.

- 2026-11-28 — s.advitya: Took on the Ganga drains location audit
  (user asked s.advitya to fix the drains properly). Triage, computed
  from the live files: 609 drains, all CPCB Pre-Monsoon 2023, no
  `coord_accuracy` field, `coords_corrected` False for 608 and True
  for 1. Distance to the Ganga main-stem line: <500 m 249, 500 m–
  1 km 84, 1–2 km 25, 2–5 km 28, >5 km 24 for the 410 main-stem
  drains; 147 of the 199 tributary drains are >5 km from the main
  stem, as expected. No pin exactly matches its town's coordinate
  in `people.geojson` (0 of 609). Pilot satellite checks (Esri
  World Imagery): Gola Ghat Drain, Varanasi is on the riverfront
  (plausibly right, outfall not visible — MEDIUM at best, not
  claimed verified); Pagal Baba Masjid Drain sits on the Varuna
  channel, so audit each drain against its own `river` field, not
  the Ganga line; Sadar Bazar Drain, Varanasi, Loni River/Drain,
  Unnao (20.52 km, in farmland) and Rooma Drain, Kanpur (2.01 km,
  in farmland) are not at outfalls — but the true outfall was not
  visible in the tiles, so no coordinates were moved and none
  invented. Method and open items in
  `data/ganga/drains_audit_NOTES.md`. Overpass (OSM waterways)
  timed out from this environment on 2026-11-28 — retry, or get
  the CPCB inventory's outfall coordinates, before moving pins
  satellite alone cannot place. Branch
  `s.advitya/ganga-drains-audit`.
