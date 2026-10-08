# Validation — 2026-10-08

- Ten tests: rendering with missing/null/empty input, normalized German/caption settings, agreement between source and generated SVG, repeated plugin instances without SVG ID collisions, all catalogue entries and translations, fixed selection, daily midnight/DST and hourly rotation, and invalid settings.
- 624 framework-backed render combinations: 13 artworks × 4 layouts × OG/X landscape/X portrait × EN/DE × captions on/off.
- Bounds checks include image box, SVG, title bar, caption and footer text overflow. Artwork is embedded; no remote artwork load is involved.
- All 156 default English screenshots are in `previews/`; `render-report.json` contains the machine-readable checks.
- The square, colonnade and staircase were inspected together in linework and shaded form, then in OG full and quadrant views. The square has a closed four-bar frame; the colonnade has one intentional reversal of crossing order; the staircase uses the public-domain standard topology with shared tread/riser endpoints.
- Joinery, Block Triangle and Hexnut were reviewed together at drawing size and in OG full/quadrant layouts. The hexnut aperture shares exact Bezier endpoints; the joinery rail ends align with their posts; the nine cubes use an exact isometric lattice.
- trmnlp is not installed here. LiquidJS, Chromium and TRMNL Framework 3.3.1 were used as the fallback renderer.
- Physical 1-bit/grayscale rasterization remains unverified. SVG edges are antialiased in the browser previews. The spaced hatching is designed to remain legible, but needs an OG hardware check.
- Half-horizontal and tall portrait views preserve the entire artwork with intentional white space. No part of the illusion is cropped.
