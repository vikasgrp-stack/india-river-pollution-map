# Godavari corridor population — notes

## What this file is

population.json: the population living within 10 km of the Godavari
centreline (the "corridor"), plus the 87-town list from people.csv.

## Method

- 10 km buffer around the OSM Godavari centreline (relation 2826093,
  1,511.3 km), in Lambert Azimuthal Equal-Area projection centred on the
  river centroid (78.0718° E, 18.7891° N). Buffer area: **26,295 km²**.
- Cells whose CENTRE falls inside the buffer are summed
  (rasterio.features.rasterize, all_touched=False).

## Results — two independent rasters agree

- **GHSL GHS-POP R2023A, 2020 epoch, 30 arc-second grid** (JRC open-data
  server / AWS mirror s3://jrc-ghsl): **10,626,120 people**
  (32,454 cells in buffer).
- **WorldPop India 2020, 100 m, UN-adjusted** (ind_ppp_2020_UNadj.tif,
  CC-BY-4.0): **10,559,786 people** (3,244,355 cells in buffer).
- The two figures are only **0.6% apart** — the corridor total is
  well-supported. Use the GHSL figure as the headline (same raster family
  as the Ganga/Yamuna/Sabarmati corridor figures); WorldPop is the
  cross-check.
- The WorldPop file was downloaded in full (1,650,056,866 bytes) into
  work/worldpop_ind_2020.tif. The first attempt died at 264 MB (server
  closed the connection, curl error 18) and a retry with a wrong URL
  404'd; the successful download used
  https://data.worldpop.org/GIS/Population/Global_2000_2020/2020/IND/ind_ppp_2020_UNadj.tif.
  data.worldpop.org does not support byte ranges, so resume is impossible
  — a fresh full download is the only recovery if the file is ever lost.
- **The summed town population (12,748,996, Census 2011) is NOT the
  corridor population** — towns are municipal figures, the corridor is a
  2020 raster sum over a 10 km buffer; the two are different quantities
  and are never compared as if one should equal the other.

Build script: work/build_population_godavari.py (geo venv:
~/workspace/.venvs/geo/bin/python). Re-run it to refresh the towns list
or the WorldPop cross-check.
