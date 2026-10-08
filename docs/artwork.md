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

An independently constructed outlined cube with contradictory over/under order: a rear upright crosses in front of the near top edge. Source: `scripts/build-art.cjs`; output: `assets/artwork/impossible-cube.svg`.

## Impossible Trident

Three circular prongs become two rectangular arms. Adapted from AnonMoos, **Poiuyt.svg** (2011), dedicated to the public domain: https://commons.wikimedia.org/wiki/File:Poiuyt.svg . The original geometric paths and end ellipses are retained; orientation, black fills, stroke weight and responsive framing are adapted for this plugin. Output: `assets/artwork/impossible-trident.svg`.

## Reversible Cubes

An independently constructed seven-cell lozenge pattern with white, hatched and black faces. This is a depth-reversal illusion, rather than an impossible object. Output: `assets/artwork/reversible-cubes.svg`.
