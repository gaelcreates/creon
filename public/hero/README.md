# Hero video files

This folder is where the cinematic hero video lives. Drop the files here, the
`HeroVideo` component picks them up automatically. **Without these files, the home
hero falls back to the Three.js animated scene** (`HeroCinematic`).

## Expected files

| File | Purpose | Required |
|---|---|---|
| `intro.mp4` | H.264 web-optimized, ~5–7 seconds, 1920×1080 or 4K | yes |
| `intro.webm` | VP9 fallback for slower devices | recommended |
| `intro-poster.jpg` | last frame as static image (shown while video loads) | recommended |

Size budget: keep `intro.mp4` **under 8 MB** for fast first paint.

## Quick placeholder via Pexels (3 minutes)

Per brief: "utilise un placeholder vidéo (n'importe quelle vidéo cinématique de
stock libre de droit, ex: Pexels) pour tester l'intégration et calibrer les
overlays texte."

1. Go to [pexels.com/search/videos](https://www.pexels.com/search/videos/cinematic%20studio%20camera/)
   — search "cinematic studio camera" or "dark studio dolly" or "cinema lens"
2. Pick a clip ~5–10 seconds, with similar mood (warm orange light, dark
   background, slow camera move)
3. Click **Free Download** → choose **HD 1920×1080**
4. Rename downloaded file to `intro.mp4` and drop it in this folder
5. From the project root, optimize for web:
   ```bash
   bash scripts/optimize-hero-video.sh public/hero/intro.mp4
   ```
   This re-encodes to web-optimized H.264 + WebM + generates poster.
6. `git add public/hero/intro.mp4 public/hero/intro.webm public/hero/intro-poster.jpg`
7. `git commit -m "Add hero video placeholder"` and push

The home hero will now play the video and the Three.js fallback will only
trigger if the file fails to load.

## Final cinematic version

When you're ready for the real thing (motion designer or Sora 2 / Veo 3):
- See `BRIEF_HERO_VIDEO.md` at the project root for the full creative brief
  and prompts ready to paste into Sora / Veo / Kling

## Generating the video yourself with AI

The brief at `BRIEF_HERO_VIDEO.md` includes 3 prompts ready to paste into:
- Sora 2 (sora.com, requires ChatGPT Plus or Pro)
- Veo 3 (Google DeepMind, available via API)
- Kling 2.5 or later (kling.kuaishou.com)

Generate 5–10 attempts per segment, pick best ones, stitch in DaVinci Resolve
(free), then `bash scripts/optimize-hero-video.sh <stitched-master.mov>`.

## Optimizing raw output for web

The `scripts/optimize-hero-video.sh` script takes a high-res MOV/MP4 and
produces:

- `intro.mp4` (H.264, 1080p, optimized for web streaming)
- `intro.webm` (VP9, 1080p, smaller for compatible browsers)
- `intro-poster.jpg` (last frame, JPEG quality 85)

**Requires `ffmpeg`**: `brew install ffmpeg` on macOS.
