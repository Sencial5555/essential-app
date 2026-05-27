# AI Detection Heatmap — Phase 4 Idea

## The Feature
After a scan completes, overlay a visual heatmap on the image highlighting the exact pixels, edges, or textures the detector found suspicious. Color-code regions — e.g. red for high suspicion, yellow for moderate — so users can see *why* an image was flagged, not just *that* it was.

## Why It's Not Possible Now
Sightengine's `genai` model returns a single confidence score for the whole image. There is no per-pixel, per-region, or bounding-box data in the response. There is nothing to draw a heatmap from.

Faking it with client-side canvas processing (edge detection, noise analysis) was explicitly rejected — it would not reflect what the detector actually found and would mislead users about why an image was flagged. A trust tool should not fabricate evidence.

## What Would Make It Possible

**Option A — Switch to Hive Moderation**
- Hive's AI-generated image detection endpoint returns bounding boxes on suspicious regions
- More expensive: ~$0.003/image vs Sightengine's current free tier
- Would require replacing or supplementing `api/scan.js`

**Option B — Host a Custom Model**
- Tools like GradCAM can produce pixel-level heatmaps from CNN-based detectors
- Requires a GPU server (Replicate, Modal, or self-hosted) — not free
- Full control over the model and output format

## Why It's a Phase 4 Thing (Not Now)
- Requires a different API or self-hosted infrastructure
- Adds meaningful per-scan cost — only justified with a paying user base
- Significant backend work: new API endpoint, image response format, frontend canvas overlay
- Revisit once Stripe revenue covers the higher per-scan cost of Hive or GPU hosting
