# Godavari drain courses — notes

## What this file is

drain_courses.csv / drain_courses.geojson — 0 rows. There is no drain
course geometry to publish for the Godavari.

## Why empty

- No published drain geometry was found for any Godavari drain: no MPR,
  CPCB report, or state publication draws a drain course as a line, and
  no OSM way carries a named Godavari drain course.
- The 20 biggest Ganga drains are drawn as lines because the Ganga build
  traced them from OSM/satellite; no equivalent tracing was done here —
  the Godavari's biggest drains (Nashik nallas, Rajahmundry Nalla
  Channel) have no published course geometry to trace from, and inventing
  a course from a town centroid would be fabrication.
- The file exists (header only / empty FeatureCollection) so the app's
  data loader finds the same file set as the other rivers.

If a published drain course appears later (e.g. an MPCB annexure with
drain alignments), add rows here with `source` + `as_of` per row.
