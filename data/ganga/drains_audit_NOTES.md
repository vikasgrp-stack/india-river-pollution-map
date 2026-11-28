# Ganga drains — location audit (s.advitya, 2026-11-28)

Status: claimed and triaged; batch 1 (the 52 main-stem drains
>2 km from the Ganga) checked against OpenStreetMap waterways.
No drain coordinates have been moved yet.

## What the data is

- 609 drains in `drains.csv` + `drains.geojson` (in lockstep), all from
  one source: CPCB Pre-Monsoon 2023. No `coord_accuracy` field on any
  drain. `coords_corrected` is False for 608, True for 1 (Hapur city
  drain, Kali East tributary).
- `river` field: Ganga 410, tributaries 199 (Kali East 29, Alaknanda
  22, Yamuna 21, Ramganga 19, Varuna 19, Sone 14, Mansahaita 12,
  Pandu 9, Jargo 9, others). `group`: main stem 437, tributary 172.
- Data status: measured 374, unmeasured 171, estimated 64.
  BOD load is known for 371 drains (total 1,050.6 tpd).

## Triage (computed 2026-11-28, distance to the Ganga main-stem line
## in `ganga_river.geojson`; the river is 300–700 m wide, so a pin
## <500 m from the centreline is in the bank zone)

- <100 m: 13 | <500 m: 236 | <1 km: 92 | <2 km: 43 | <5 km: 49 |
  <10 km: 38 | >10 km: 133.
- Main-stem drains (`river` = Ganga, 410): <500 m 249, 500 m–1 km 84,
  1–2 km 25, 2–5 km 28, >5 km 24.
- Tributary drains (199): 147 are >5 km from the main stem, as
  expected — they discharge to a tributary, not the Ganga. They
  cannot be audited against the main-stem line; they need the
  tributary river lines, which are not in the repo.
- No drain pin exactly matches its town's coordinate in
  `people.geojson` (0 of 609), so the pins are not copies of the
  town file — they are geocoded place-name points, and the audit
  must check each one against its own receiving watercourse.

## CORRECTION to the first triage (2026-11-28, same day)

Distance to the Ganga line misleads. Most of the 52 "inland"
main-stem drains are NOT town centroids: checked against OSM
waterways, 38 of the 52 are within 500 m of a mapped channel and
21 are within 100 m — the CPCB pin sits on the drain's own
channel (or on its receiving tributary), and the channel runs
some distance before it meets the Ganga. The pin is a CPCB
measurement point on the channel, not the outfall into the
Ganga. So the fix for those 38 is to map the course from the
pin to the river (as the existing 20 courses in
`drain_courses.geojson` already do for the top-20 drains), not
to move the pin. Only 14 of the 52 are genuine misses (below).

## Method that works (2026-11-28)

- Overpass API is unreachable from this environment (all three
  public endpoints time out). The OSM API map call works:
  `https://api.openstreetmap.org/api/0.6/map?bbox=...` — use
  small bboxes (dense cities such as Prayagraj hit the 50,000
  node limit; use ±0.008° boxes there).
- For each drain: nearest OSM waterway (`drain`/`stream`/
  `river`/`canal`) to the pin. <100 m = on the channel;
  100–500 m = near the channel, check on satellite; >500 m or
  no waterway in a ±1.5 km box = genuine miss.
- Esri World Imagery tiles cross-check the channel where OSM
  is thin. Never move a pin to a guessed point: move it only
  where the channel/outfall is visible, otherwise mark it
  `town-centroid` and leave the pin.
- Record per drain, in GeoJSON + CSV in lockstep:
  `coord_accuracy` (satellite-verified / town-centroid),
  `coord_source` (Esri World Imagery + OpenStreetMap, verified
  <date> by s.advitya), `coord_confidence` (HIGH / MEDIUM).
  HIGH only where the outfall/channel is clearly visible.

## Batch 1 — the 52 main-stem drains >2 km from the Ganga

Checked 2026-11-28 against OSM waterways (nearest channel):
<100 m: 21 | 100–500 m: 17 | >500 m: 10 | no waterway in box: 4.

On the channel (<100 m): Loni River/Drain, Unnao (13 m, river);
Green belt canal, Haldia (5 m, canal); Bans Ghat Drain, Patna
(10 m, stream); Pandey Wala Drain, Haridwar (8 m, stream);
Kassavan Drain, Haridwar (4 m, river); Rajapur Drain, Patna
(1 m, drain); Drain at Haldia (6 m, canal); Khanua Nala,
Chapra (73 m, Ghaghara river); Champa Nala-1, Bhagalpur
(74 m, Champa Nala); Jagjeetpur STP Drain, Haridwar (87 m);
NTPC Drain, Dalmau (25 m, canal); Hathiya Nala near Tilak
Manjhi, Bhagalpur (3 m, stream); Raghopur Dugar Nala,
Baktiyarpur (68 m); Koyal Ghat Drain, Bhagalpur (97 m, Champa
Nala); Kuppa Ghat, Bhagalpur (90 m, Champa Nala); Saklichand
Drain, Bhagalpur (57 m, Champa Nala); Phuldera Drain, Hapur
(20 m, canal); Bagad Drain, Bijnor (4 m, Bagad River);
Awas Vikas Nala, Haridwar (1 m, drain); Adampur Nala,
Bhagalpur (61 m, Champa Nala); Lal Mandir Nala, Haridwar
(61 m, Ganga Canal).

100–500 m (near a channel, needs a satellite look before
calling it): Tapaswi Ghat Nala, Mokama (199 m); Kamaleshwari
Asthan Drain, Mokama (298 m); Champa Nala-2, Bhagalpur
(112 m); Khirni Ghat, Bhagalpur (163 m); Lakkar Ghat STP
Drain, Rishikesh (238 m); Chaudhary Ghat, Mokama (334 m);
Sahebganj Miyabari Nala, Bhagalpur (384 m); Sarkikal Drain,
Bhagalpur (162 m); Hathiya Nala near intake well, Bhagalpur
(130 m); Kalighat, Fatua (257 m, Punpun); Kataiya Ghat,
Fatua (381 m, Punpun); Devanti Ghat, Fatua (315 m, Punpun);
Matra Sadan Drain, Haridwar (322 m); Ponghat Drain,
Prayagraj (167 m, canal); Gopalpul Nallah, Sahebganj
(497 m); DN Singh Drain, Bhagalpur (724 m — over 500 m,
see misses).

Genuine misses — >500 m from any mapped channel, or no
waterway in a ±1.5 km box (14): Rooma Drain, Kanpur
(1,176 m, nearest canal); Shankarpur Road Nala, Dighwara
(1,134 m); Sadar Bazar Nala, Prayagraj (1,020 m, canal);
Near milan telecome nala, Swargashram (1,552 m, stream);
Dargah shareef Drain, Chunar (1,303 m, nearest Paisuni
river); Mumfordganj Drain, Prayagraj (856 m, canal); Kodra
Drain, Prayagraj (771 m); Chetawala Drain, Hastinapur (no
waterway in box); Lal Darwaja Drain, Munger (none);
Hathikhana Drain, Farrukhabad (none); ITC Drain, Munger
(none); Makshudpur drain (East) and (West), Fatua (508 m
and 534 m from an OSM way named Ganga — see discrepancy
below); DN Singh Drain, Bhagalpur (724 m, Champa Nala).

Also checked earlier by satellite tile: Gola Ghat Drain,
Varanasi (0.26 km) is on the riverfront at the ghats
(plausibly right, outfall not visible — MEDIUM at best);
Pagal Baba Masjid Drain, Varanasi sits ON the Varuna
channel; Sadar Bazar Drain, Varanasi (5.03 km from the
Ganga line) is 29 m from the Varuna river way — again, a
tributary drain, not a town centroid.

## Open discrepancies

- Fatua: the two Makshudpur drains are ~10.8 km from the
  repo's Ganga line but only ~0.5 km from an OSM way named
  Ganga. Either the repo's `ganga_river.geojson` line is off
  by ~10 km there, or the OSM way is a side channel with the
  wrong name. Do not move anything until this is resolved
  on satellite imagery.
- Several Fatua drains sit near the Punpun river, not the
  Ganga, although their `river` field says Ganga. The
  `river` field may mean "Ganga basin" for these, or it may
  be wrong — check against the CPCB inventory.
- Dargah shareef Drain, Chunar is 81.34 km from the Ganga
  line; its nearest waterway is the Paisuni, 1.3 km away.
  Likely a tributary drain with a wrong `river` field, or a
  wrong pin — needs a closer look.

## What is still open

- Map courses (pin → receiving river) for the 38 on/near-
  channel drains in batch 1, extending the existing
  `drain_courses.geojson` pattern.
- Resolve the 14 genuine misses: find their channel on
  satellite, or mark `town-centroid` and leave the pin.
- Then the 25 main-stem drains at 1–2 km, then the 199
  tributary drains (needs tributary lines).
- The same audit is still unclaimed for water-quality
  stations (115 Ganga) and industries (25 Ganga), and for
  the other four rivers' drains.
