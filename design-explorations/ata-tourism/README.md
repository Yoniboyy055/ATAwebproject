# ATA Eritrea tourism: design exploration (issue #24)

**Status: design exploration for owner selection. Not implementation approval. Not launch-ready. Do not merge.**
Nothing outside `design-explorations/ata-tourism/` was changed. No application code, routes, styles, schema, APIs, credentials, deployment config or existing PRs were touched, and no Supabase, Builder or Vercel connection was made.

## How to review
Serve this folder over HTTP (the pages load images and a script by relative path):

```
cd design-explorations/ata-tourism && python3 -m http.server 8000
```

Then open `http://localhost:8000/comparison.html`, which links the three prototypes:

| File | Concept |
|---|---|
| `homecoming.html` | HOMEComing: diaspora belonging, scroll-driven night-to-evening photo scenes |
| `journey.html` | Journey Through Eritrea: full-screen satellite map that follows the real road down the escarpment |
| `escape.html` | Cultural Escape: premium editorial, pinned gallery with Blender-rendered 3D turns |

Every enquiry form is a demo and sends or stores nothing. A "Review notes" button on each page lists the items awaiting ATA confirmation.

## Please check (reviewer checklist)
- [ ] Each page is a working scrollable experience at desktop and phone width, with keyboard access and `prefers-reduced-motion`.
- [ ] No price, date, duration, capacity or availability is stated anywhere.
- [ ] No item from the WP-03 prohibited-claims register appears; conditional items are listed in the Review notes.
- [ ] Rights and licences below are acceptable (this is the main blocker).
- [ ] Comparison scores and the hybrid recommendation in `comparison.html`.

## Media, sources and licences (blockers before any public use)
| Asset | Source | Licence / status |
|---|---|---|
| `real/*.webp` photographs | Wikimedia Commons (cropped, graded, sharpened) | CC0, CC BY or CC BY-SA. Credits are in each page footer. CC BY-SA photos must keep that licence if adapted. |
| `own/photo-tagliero.webp`, `own/photo-switchbacks.webp`, `own/earth-*.webp` | Supplied by the owner (two web photographs, two Google Earth screenshots) | **Source and licence unknown. Google imagery normally needs Google's permission or a licensed provider.** Review-only. |
| `own/map/*.webp` satellite tiles | Sentinel-2 cloudless by EOX (modified Copernicus Sentinel data 2020) | **CC BY-NC-SA 4.0, non-commercial only.** A commercial launch needs EOX's commercial licence or another licensed provider. |
| Road route | OpenStreetMap contributors (ODbL) | Attribution on page. |
| Altitude profile | Terrain Tiles on AWS (open data incl. SRTM) | Values can differ from quoted figures (e.g. 2,325 m) by a few tens of metres. |
| `own/seq/*.webp`, `own/dio-*.webp` | AI-generated meshes from the photos above, rendered in Blender (Cycles) | Stylised illustrations, not surveyed models. Unseen sides are inferred. |
| `art/*.webp` | AI-generated sculptural objects and icons | Illustrations, not photographs. |

Dahlak and the wide panorama from the existing ATA site were deliberately left out: the Dahlak file shows desert ruins under a Dahlak label, and the panorama may be synthetic.

## Open questions for the ATA owner
See `comparison.html` (Questions section). The most important: who answers enquiries and how fast, whether the Massawa condition may be stated openly, whether a travel permit applies to the coastal leg (unverified, must not be published), the exact UNESCO wording, and who supplies rights-cleared photography.

## Tools
`tools/render_turntable_blender.py` renders a 24-frame turntable from a GLB with Blender's Python module. `tools/build_terrain_profile.py` builds the elevation profile and route data from open terrain tiles.
