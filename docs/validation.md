# Validation — 2026-10-08

- Six tests: rendering with missing/null/empty input, normalized German/caption settings, agreement between source and generated SVG, and repeated plugin instances without SVG ID collisions.
- 48 framework-backed render combinations: 4 layouts × OG/X landscape/X portrait × EN/DE × captions on/off.
- Bounds checks include image box, SVG, title bar, caption and footer text overflow. Artwork is embedded; no remote artwork load is involved.
- All 12 default English screenshots are in `previews/`; `render-report.json` contains the machine-readable checks.
- trmnlp is not installed here. LiquidJS, Chromium and TRMNL Framework 3.3.1 were used as the fallback renderer.
- Physical 1-bit/grayscale rasterization remains unverified. SVG edges are antialiased in the browser previews. The spaced hatching is designed to remain legible, but needs an OG hardware check.
- Half-horizontal and tall portrait views preserve the entire triangle with intentional white space. No part of the illusion is cropped.
