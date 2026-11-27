# Sabarmati corridor population — notes

## What this file is

The population living within 10 km of the Sabarmati centreline, computed
from raster population data (the same method as the Ganga and Yamuna files),
plus the Census 2011 populations of the 12 mapped towns.

## Result

- **Corridor population (GHSL, 2020): 9,420,107** — 10 km buffer around the
  OSM centreline (buffer area 6,765 km², centreline 383.1 km), 8,521 GHSL
  cells whose centres fall inside the buffer.
- **WorldPop cross-check: pending** (see below).
- **Summed town populations (Census 2011): 6,209,009** across the 12 towns
  (11 with a published population; Chiloda blank). This is NOT the corridor
  population — the corridor figure counts everyone in the 10 km strip,
  including villages and the Ahmedabad urban agglomeration.

## Method

GHSL GHS-POP R2023A, epoch 2020, 30 arc-second grid, read via `/vsis3/` from
the JRC AWS open-data mirror
(`s3://jrc-ghsl/ghs-pop/r2023a/4326/30asec/2020/GHS_POP_E2020_GLOBE_R2023A_4326_30ss_V1_0.tif`),
window 72.3–73.4E / 22.0–24.8N. Cells whose **centre** falls inside the
buffer are summed (`rasterio.features.rasterize`, `all_touched=False`).
Buffer built in Lambert Azimuthal Equal-Area centred on the river centroid
(72.7518E / 23.4424N). Script: `work/build_population_sabarmati.py`.

## WorldPop cross-check — pending, and why

The WorldPop India 2020 100 m UN-adjusted file
(`ind_ppp_2020_UNadj.tif`, 1,650,056,866 bytes) is **still downloading** in
`work/worldpop_ind_2020.tif` (163,647,488 bytes at 09:16 UTC, 27 Nov 2026 —
about 10% complete after ~12 minutes). A remote windowed read via `/vsicurl`
was attempted and failed immediately: **"Range downloading not supported by
this server!"** — data.worldpop.org does not serve HTTP range requests through
this network, so the file cannot be read remotely; only the completed local
download can be clipped.

To finish the cross-check: wait for `work/worldpop_ind_2020.tif` to reach
1,650,056,866 bytes, then re-run `work/build_population_sabarmati.py` (it
detects the complete local file and computes the cross-check). Delete the
1.65 GB file afterwards, as was done for the Yamuna build.

For scale: on the Yamuna, WorldPop came in ~6% below GHSL (34.3M vs 36.6M).
A similar relationship is expected here, but it is not assumed — the field is
left null until computed.
