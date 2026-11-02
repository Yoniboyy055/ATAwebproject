# ATA Art Direction V2 (visual-only review, issue #24)

**Design exploration for owner review. Not approved, not an implementation, not launch-ready. Do not merge.**
Separate from the rejected prototype PR #25. Nothing outside `design-explorations/ata-art-direction-v2/` is changed; no site code, routes, styles, config or deployment.

Open `index.html` (serve the folder over HTTP: `python3 -m http.server`). It shows V1 to V2 comparisons, the hero (desktop 1440 and mobile 390), a one-move scroll storyboard, the human-led enquiry scene, the style system, 3D justification and an honest self-critique.

## Media provenance and rights
| Asset | Source | Status |
|---|---|---|
| V2 frames (`A_*`, `B_*`, `C_*`) | Composed from **AI-generated concept images** (Higgsfield Cinema Studio 2.5 and GPT Image 2.5, text prompts only) | Concept art, labelled on every frame as not a photograph. Not documentary evidence of Eritrea. Check the provider's commercial terms before any use. The generated source images are not stored in this repo. |
| `V1_*` comparison frames | Wikimedia Commons photographs (CC BY / CC BY-SA / CC0): Cinema Impero by Mheidegger (CC BY 4.0), road by Clay Gilliland (CC BY-SA 2.0), Massawa harbour by Reinhard Dietrich (CC0) | Comparison only. CC BY-SA adaptations must keep that licence. |
| Altitude readout | Terrain Tiles on AWS (incl. SRTM) along the OpenStreetMap road | Open data, attribution needed on public use. Values can differ from quoted figures by tens of metres. |
| Not used | EOX satellite tiles (non-commercial), Google Earth, owner-supplied photos with unknown rights | Excluded. |

## Known limits
Reads as AI; plate seams hidden by haze; convincing soft-realism 3D not achieved (surfaces lit and layered only); the "3D Soft Realism" reference screenshot was not seen; nothing validated on real devices or with viewers. ATA must confirm all words, the named contact, and every commercial term. No price, date, duration or availability appears.

`source-html/` holds the HTML used to render the frames (they reference generated images that are not in the repo). `grade_script.py` is the colour-grade script applied to every image.
