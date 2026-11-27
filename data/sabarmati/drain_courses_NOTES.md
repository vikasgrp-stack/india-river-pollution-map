# Sabarmati drain courses — notes

## What this file is

`drain_courses.geojson` is an **empty FeatureCollection** (and
`drain_courses.csv` has headers only). No drain course geometry is published
for any Sabarmati drain, and no OSM way carries a named Sabarmati drain
course in the sources used.

This is the same convention as a river with no courses: the file exists so
the app's loader finds it, with zero features.

## What would add courses

The Najafgarh (114.51 km) and Barapulla (2.76 km) courses on the Yamuna
exist because those drains are named waterways in OSM. On the Sabarmati, the
big drains (Old Pirana pumping station outfall, Old Vasna pumping station
outfall, Danilimda storm drain) are pumping-station outfalls and underground
pipelines, not named surface waterways, so there is nothing to draw. A
future field/GIS survey of the Pirana and Vasna outfall channels could add
1–2 courses.
