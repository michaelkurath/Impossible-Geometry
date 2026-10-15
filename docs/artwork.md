# Penrose triangle

Asset: `assets/artwork/penrose-triangle.svg`.
Source: `scripts/build-art.cjs`; the same SVG is embedded in `src/shared.liquid`.

The shape uses the conventional Penrose tribar construction, with three locally plausible faces forming a globally impossible loop. Coordinates were rebuilt on an exact 60-degree lattice. Broad black and white faces and sparse diagonal hatching follow the agreed simple geometric direction. No Escher composition is reproduced; the live vector is not an AI-generated bitmap.

Geometry reference: Tobias R. / Metoc, **Penrose-dreieck.svg**, 5 August 2007, Wikimedia Commons. The file page identifies it as public domain (PD-ineligible).

- File and attribution: https://commons.wikimedia.org/wiki/File:Penrose-dreieck.svg
- Reference SVG: https://upload.wikimedia.org/wikipedia/commons/c/c1/Penrose-dreieck.svg

Adaptation: regularized exact geometry, face styling, hatch clipping and responsive layout. Black/white endpoints and outlines remain consistent at each junction. Hatch segments are explicit paths instead of SVG pattern definitions, avoiding collisions when multiple instances share a page.

Superseded generated architectural studies are retained in Git history, not in the active artwork or catalogue.

## Impossible Cube

A flat-faced cube assembled from white top, hatched frontal and black lateral regions. The recessed rear upright crosses the near top edge, reversing the expected order of depth. The rear-left junction uses three clean, shared face boundaries. Source: `scripts/build-art.cjs`; output: `assets/artwork/impossible-cube.svg`.

## Impossible Trident

Three circular prongs become two rectangular arms. Adapted from AnonMoos, **Poiuyt.svg** (2011), dedicated to the public domain: https://commons.wikimedia.org/wiki/File:Poiuyt.svg . The original geometric paths and end ellipses are retained; orientation, black fills, stroke weight and responsive framing are adapted for this plugin. Output: `assets/artwork/impossible-trident.svg`.

## Reversible Cubes

An independently constructed seven-cell lozenge pattern with white, hatched and black faces. This is a depth-reversal illusion, rather than an impossible object. Output: `assets/artwork/reversible-cubes.svg`.

## Kanizsa Triangle

Three black disks with 60-degree openings sit at the vertices of an exact equilateral triangle. Larger inducers strengthen the bright triangle whose edges are absent. Constructed with circular arcs in `scripts/build-art.cjs`.

## Necker Cube

Two offset square wireframes and four connecting edges form a reversible depth reading. All twelve edges stay visible.

## Reversible Steps

A Schroeder-style construction uses two matching five-step profiles joined by parallel depth edges. Equally hatched flanking walls support either depth reading. Each step is 60 by 60 units; the second profile is translated by (100, -55).

## Impossible Square

A sharp four-bar built from three nested square boundaries and one diagonal offset. The continuous white and hatched bands change their apparent face orientation at the corners. Coordinates, face regions and monochrome styling are independently constructed in `scripts/build-art.cjs`; output: `assets/artwork/impossible-square.svg`.

Concept reference: Cameron Browne, *Impossible Fractals*, section 5, describes the sharp and truncated four-bar constructions: https://im-possible.info/english/articles/cameron-browne-2007/5-squares.html . The paper's illustrations are not embedded in the plugin.

## Impossible Colonnade

An independently projected six-pillar frame. All ordinary rails and posts use the same square-section box projection. The centre rear pillar deliberately occludes the upper near rail, while its lower end remains attached to the rear lower rail. That contradictory ordering is the illusion; the upright stays continuous and its ends have ordinary beam junctions. The construction uses explicit face polygons and hatch segments, without masks or global SVG IDs.

Concept reference: Diego Uribe, *A Set of Impossible Tiles*, sections “Crossing bars” and “Escher's Belvedere structure”: https://im-possible.info/english/articles/tiles/tiles.html . This asset is a new sparse frame, with no palace, figures or other elements from an Escher composition. Output: `assets/artwork/impossible-colonnade.svg`.

## Penrose Staircase

Thirteen white treads form four continuously ascending flights. Black inner/right walls and a hatched front wall preserve the same face treatment as the other solid constructions. Riser faces and tread edges share exact endpoints; small rounding differences in the reference were regularized. Output: `assets/artwork/penrose-staircase.svg`.

Adapted from Philip Ronan / Sakurambo, **Impossible staircase.svg**, released by its creator into the public domain. Source and license: https://commons.wikimedia.org/wiki/File:Impossible_staircase.svg . The original SVG is also reproduced with its source credit in https://gist.github.com/kenwebb/92dea81937a424e202c5 . Changes: integer/shared coordinates, explicit polygon faces, black/white fills, sparse clipped hatching, stronger outlines, accessible title and responsive framing. This is the standard geometric staircase; no Escher building or composition is reproduced.

## Impossible Joinery

Four square-section beams form a sparse crossed frame. The ascending and descending rails exchange their attachment depth at the far upright. Shared endpoints and painter order preserve ordinary local joints while introducing a contradictory global reading. Coordinates and face regions are independently constructed; no reference image is embedded. Output: `assets/artwork/impossible-joinery.svg`.

Concept reference: Eric Weisstein / Margherita Barile, *Impossible Joinery*, MathWorld, describing four-bar constructions and citing T. H. O'Beirne: https://mathworld.wolfram.com/ImpossibleJoinery.html .

## Block Triangle

Nine separately drawn cubes suggest a triangular loop. Cube faces and centres are derived from an exact 60-degree lattice, with equal cube sizes and regular gaps along each flight. White tops, hatched left faces and black right faces retain the collection's visual language. Output: `assets/artwork/block-triangle.svg`.

Concept reference: Cameron Browne, *Impossible Fractals*, section 6, Figure 9, discusses the subcube form of the tribar and its relationship to Reutersvaerd's early impossible figures: https://im-possible.info/english/articles/cameron-browne-2007/6-cubes.html . This is a newly constructed geometric diagram, not a reproduction of an artist's illustration.

## Impossible Hexnut

A faceted outer outline and four independently defined cubic Bezier bore curves use the conventional ambihelical topology. The inner left return continues into the outer right face; opposite bore endpoints lead to different depth readings. The two aperture curves share exact endpoints, without a second loop or dangling seam. New proportions, curves and monochrome face treatment are defined in the generator. Output: `assets/artwork/impossible-hexnut.svg`.

Concept reference: Eric Weisstein / Margherita Barile, *Ambihelical Hexnut*, MathWorld: https://mathworld.wolfram.com/AmbihelicalHexnut.html . The reference SVG is not imported or redistributed. No Escher composition is reproduced.

## Catalogue review

See [the 9 October review](artwork-review.md) for all thirteen ratings, corrections and remaining weaknesses.
