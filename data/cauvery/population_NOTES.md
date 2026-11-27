# Cauvery corridor population — notes

## What this file is

`population.json`: the population living within 10 km of the Cauvery
centreline (the corridor), from GHSL GHS-POP R2023A (2020 epoch), plus the
41 towns from `people.csv`. Built by `work/build_population_cauvery.py`
(run with `~/workspace/.venvs/geo/bin/python`).

## Headline figure

- **Corridor population (GHSL 2020): 9,022,109** in a 10 km buffer of
  14,330 km² (Lambert Azimuthal Equal-Area, centred 77.5098E/11.7888N),
  17,123 GHSL cells whose centres fall inside the buffer.
- Method: GHSL GHS-POP R2023A, epoch 2020, 30 arc-second grid, read via
  `/vsis3/` from the JRC AWS open-data mirror
  (s3://jrc-ghsl/GHS_POP_E2020_GLOBE_R2023A_4326_30ss_V1_0.tif), window
  lon 75.3–80.0, lat 10.7–12.8; cell values summed where the cell centre
  falls inside the buffer (`rasterize`, `all_touched=False`).

## Window correction — read this

The first run used a window of lon 75.3–80.0, lat 10.9–12.6 and returned
6,900,259 (15,029 cells). That window was **too tight**: the centreline runs
to lat 10.8298 in the delta and 12.6237 in the north, and the 10 km buffer
extends ~0.09° beyond the centreline on all sides (down to ~10.74N, up to
~12.71N). The tight window cut off the southern delta strip and the
northern buffer edge, missing ~2.1 million people. The window was widened
to lat 10.7–12.8, which fully contains the buffer (buffer bounds approx.
lon 75.44–79.95, lat 10.74–12.71). **The correct figure is 9,022,109.**
The script now carries the corrected window with a comment explaining why.

## WorldPop cross-check — pending

- **Status: pending.** The remote `/vsicurl` read of the WorldPop India
  2020 file (100 m, UN-adjusted, `ind_ppp_2020_UNadj.tif`, 1,650,056,866
  bytes) failed with "Range downloading not supported by this server!" —
  the same failure the Sabarmati build hit on this network.
- **No full 1.65 GB file was downloaded** and none was left behind. The
  script deliberately does not start a multi-GB download (the Sabarmati
  build's download of the same file timed out on this network). Re-run
  `build_population_cauvery.py` once a local copy of the file is available;
  the script records the cross-check as pending with the reason until then.
- `population.json` therefore has `corridor_10km_worldpop_2020: null` and
  the pending status string in `cross_check_worldpop_2020_100m_unadj`.

## Towns vs corridor — do not confuse them

- The 41 towns in `people.csv` sum to **16,103,461** (Census 2011). That is
  NOT the corridor population. It includes Bengaluru (8,443,675, 78.9 km
  from the centreline) and Coimbatore (1,601,438, 91.3 km away), both far
  outside the 10 km buffer, plus 22 other Tier 2 towns outside the buffer.
  The corridor figure (9,022,109, GHSL 2020) counts everyone living within
  10 km of the river, whether or not they live in a listed town.
- The two figures are for different things (2020 modelled grid vs 2011
  town census) and must not be compared as if one validates the other.

## Sanity check

9,022,109 people over 14,330 km² is ~630/km² — plausible for a corridor
that runs through the densely settled Cauvery delta (Thanjavur, Kumbakonam,
Mayiladuthurai) and past Tiruchirappalli, Erode's fringe, Karur and the
Mysuru fringe, with farmland between the towns. For comparison, the
Sabarmati corridor is 9,420,107 over 6,765 km² (~1,392/km²) — denser
because it contains Ahmedabad.

## Sources

- GHSL GHS-POP R2023A, epoch 2020, 30 arc-second (4326_30ss), JRC
  open-data server / AWS mirror s3://jrc-ghsl.
- WorldPop India 2020, 100 m, UN-adjusted (ind_ppp_2020_UNadj.tif),
  CC-BY-4.0 — attempted, pending (see above).
- Town populations: Census of India 2011 via Wikipedia town articles —
  see `people_NOTES.md`.
