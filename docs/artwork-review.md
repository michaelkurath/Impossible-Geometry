# Artwork review — 9 October 2026

Scores are visual judgments out of 10, combining local geometric consistency, strength of the intended illusion and readability in the small TRMNL layouts. They are not mathematical certification or a viewer study. A depth-reversal illusion is assessed on its own terms, not required to be an impossible solid.

| Artwork | Before | After | Assessment / action |
| --- | ---: | ---: | --- |
| Penrose Triangle | 9 | 9 | Strong silhouette, coherent three-face cycle. Retained. |
| Impossible Cube | 5.5 | 6.5 | Aligned shared vertices at several junctions to reduce slivers and discontinuities. Its dense corner construction remains a weakness; not rated as fully resolved. |
| Impossible Trident | 8 | 8 | Standard three-prong/two-arm contradiction, readable open linework. Retained. |
| Reversible Cubes | 8.5 | 8.5 | Regular lozenge lattice and consistent face treatment. Retained. |
| Kanizsa Triangle | 6 | 8.5 | Corrected centre spacing to an exact equilateral triangle; enlarged inducers to strengthen the implied edges. |
| Necker Cube | 8.5 | 8.5 | Clear, consistent wireframe with two plausible depth readings. Retained. |
| Reversible Steps | 4 | 8.5 | Rebuilt as a Schroeder-style stair with matching profiles, parallel depth edges and equally shaded flanking walls. Replaces the weak narrow zigzag. |
| Impossible Square | 8 | 8 | Clear four-bar contradiction and continuous face bands. Retained. |
| Impossible Colonnade | 6.5 | 6.5 | One deliberate depth-order contradiction; the crowded top frame still makes it less immediate at small sizes. Retained pending a stronger composition. |
| Penrose Staircase | 8 | 8 | Recognizable closed ascending loop, shared tread endpoints. Retained. |
| Impossible Joinery | 5.5 | 6.5 | Changed hatch direction on the ascending beam, removing long near-parallel stripes. Joint geometry retained; the paradox remains subtler than the strongest entries. |
| Block Triangle | 6 | 8 | Enlarged equal cubes on the same lattice, reducing gaps and strengthening the implied closed loop. |
| Impossible Hexnut | 7 | 7 | Bore topology is coherent as an ambihelical drawing, but its contradiction requires tracing; the black return is visually heavy. Retained. |

## Changes and limits

The cube correction is deliberately limited to shared endpoints. An exploratory regular box-frame reconstruction weakened the illusion and was discarded before publication. The existing composition is retained; the review does not claim every perceptual issue is solved.

The Kanizsa centres are `(300,90)`, `(100,90+200√3)` and `(500,90+200√3)`. All sides are 400 units. Each opening is 60 degrees and points along the two incident triangle edges.

The reversible stair has five 60-by-60 steps. Its second profile is a uniform `(100,-55)` translation of the first. Every corresponding vertex is connected; equal wall hatching avoids imposing a single lighting-based depth interpretation.

Block centres are unchanged. Increasing cube half-width from 43 to 48 units makes the projected gaps smaller while preserving separation and consistent face orientation.

Geometry reference for the reversible stair concept: https://www.illusionsindex.org/i/schroeder-s-stairs . Independently constructed coordinates; no reference artwork is embedded.

Validation: 10 automated tests; 624 framework-backed layout combinations across 13 artworks, four layouts, OG/X landscape/X portrait, both languages, and both caption settings. Browser previews do not verify physical e-paper rasterization. See `validation.md` and `../previews/render-report.json`.
