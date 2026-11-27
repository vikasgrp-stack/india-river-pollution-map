# Cauvery drain courses — notes

## What this file is

An empty dataset: `drain_courses.csv` (header only) and
`drain_courses.geojson` (empty FeatureCollection), following the Sabarmati
convention for a river with no published drain-course geometry.

## Why it is empty

No published drain-course geometry exists for any Cauvery drain. No OSM way
carries a named Cauvery drain course, and neither the Karnataka nor the Tamil
Nadu MPRs publish drain alignments. The drain rows in `drains.csv` are
plotted at town centroids; their courses are not mapped.

## Gaps

- All 14 drains in `drains.csv` have no course geometry. If drain alignments
  are ever published (e.g. by BWSSB for the Vrishabhavathi valley, or by the
  Tamil Nadu PWD for the Erode / Kumarapalayam / Pallipalayam outfalls),
  they should be added here.
