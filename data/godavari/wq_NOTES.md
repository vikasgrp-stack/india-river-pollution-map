# Godavari water quality — notes

## What this file is

86 water-quality stations on the Godavari main stem and tributaries
(Maharashtra 42, Telangana 32, Andhra Pradesh 10, Madhya Pradesh 1,
Puducherry 1), from CPCB Polluted River Stretches 2022, Telangana NWMP
monthly data (Jun–Jul 2021) and the AP MPR Jan 2025. BOD/DO series are
in the bod_YYYY / do_YYYY year columns; `bod_earliest` / `bod_latest`
are the first and last available values.

## Coverage

- **Worst station**: Vasistha, D/s Narasapuram — **BOD 58.0 mg/l**
  (2019–21 max, CPCB PRS 2022).
- **Worst stretch**: Maharashtra Godavari main stem — BOD max **28.0
  mg/l** (Kapila–Godavari confluence; Tapovan 27.0, Panchavati Ramkund
  14.0), Priority II.
- **Worst DO**: Nakkavagu at Bachugudem — **1.6 mg/l** (Jun 2021) / 2.0
  (Jul 2021), BOD 8.5 / 8.0.
- **Trends**: improving 5, worsening 2 (Maneru dump site 3.2→5.4 mg/l,
  Ghattepalli 2.1→3.0), stable 79. Only Telangana stations have two
  comparable points (NWMP Jun→Jul 2021); all other stations are "stable"
  per the Sabarmati convention (no comparable second point).
- `bod_change_pct` is filled only where earliest/latest are both NWMP
  monthly values (11 stations).

## Comparability — read this first

The years are **NOT like-for-like snapshots**: 70 stations carry CPCB
PRS 2022 maxima (2019–21, stored as 2021 values); Telangana stations
carry Jun–Jul 2021 monthly samples; AP stations carry single Jan 2025
values; NEERI Nashik samples are 2013–14. There is **no continuous
annual series** for any station, no faecal-coliform series, no TN/P
series, and no real-time stations.

## Corrections applied at assembly

- **3 stations dropped, all on the Tapi Purna**: 2700 Purna–Asegaon
  (BOD 6.0), 1913 Purna–Dhupeshwar (6.8), 2155 Purna–Andura (6.8). CPCB
  PRS 2022 itself places them at Achalpur–Amravati road bridge /
  Malkapur, Akola — the Tapi tributary, not the Godavari's Purna.
- One correction made during build: PRS station 2699 is
  Penganga–Mehkar (5.0) and 2700 is Purna–Asegaon (6.0) — an early draft
  had them swapped.

## Gaps

- **No PRS station rows for the Indravati or Sabari**, and no
  Chhattisgarh/Odisha MPR obtained — the big eastern tributaries are
  essentially unmonitored in the published record.
- No MH MPR newer than Aug 2020, no TS MPR newer than Sep 2021, no AP
  MPR other than Jan 2025 obtained.
- Geocode audit caught 8 wrong same-name Nominatim hits before build
  (e.g. Basara→Basheer Bagh Hyderabad, Rajura→Achalpur); all re-geocoded
  with district qualifiers or fallen back to town coordinates. All 86
  coordinates verified inside India; no coordinate invented.

Full per-station audit trail: work/drains_wq/drains_wq_NOTES.md.
Build script: work/drains_wq/build_godavari.py (+ geocode_cache.json).
