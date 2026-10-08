# Validation — 2026-10-08

- Four input/rendering tests passed: missing input, null input, empty settings, and normalized German/caption settings.
- Framework-backed Chromium rendering: 48 combinations (4 layouts × OG/X/X portrait × EN/DE × captions on/off).
- Image-load and bounds checks passed in the initial run. Visual review caught a clipped long instance in X portrait smaller views; compact footers now show artwork title and entry number, and instance elements are included in bounds checks.
- All 12 default English previews visually inspected. Full landscape is the intended presentation. Narrow portrait and half-horizontal retain the entire composition with substantial white space.
- `trmnlp` is unavailable in this environment; LiquidJS and TRMNL 3.3.1 Chromium rendering were used instead.
- Remote image is substituted with its identical local file for reproducible rendering; deployed URL requires separate verification after push.
- Physical e-paper tone reproduction has not been verified. Optical impossibility is still a design limitation, not a test pass.

See `previews/render-report.json` for the final machine-readable report and PNGs alongside it.
