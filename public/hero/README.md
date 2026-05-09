# Hero video files

This folder is where the cinematic hero video lives. Drop the files here, the
`HeroVideo` component picks them up automatically.

## Expected files

| File | Purpose | Required |
|---|---|---|
| `intro.mp4` | H.264 web-optimized, ~6 seconds, 1920×1080 or 4K | yes |
| `intro.webm` | VP9 fallback for slower devices | recommended |
| `intro-poster.jpg` | last frame as static image (shown while video loads) | recommended |

Size budget : keep `intro.mp4` **under 8 MB** for fast first paint.

## Generating the video

See `BRIEF_HERO_VIDEO.md` (root of project) for the full creative brief, including
prompts ready for Sora 2 / Veo 3 / Kling.

Quick recap :

1. Generate 3 segments via Sora/Veo/Kling using the prompts
2. Stitch in DaVinci Resolve (free)
3. Run `bash scripts/optimize-hero-video.sh /path/to/raw.mp4` (see below)
4. Drop output files here
5. Push to git, Vercel auto-deploys

## Optimizing raw output for web

The `scripts/optimize-hero-video.sh` script takes a high-res MOV/MP4 and produces:

- `intro.mp4` (H.264, 1080p, optimized for web streaming)
- `intro.webm` (VP9, 1080p, smaller for compatible browsers)
- `intro-poster.jpg` (last frame, JPEG quality 85)

**Requires `ffmpeg`** : `brew install ffmpeg` on macOS.

## Switching from Three.js fallback to video

In `app/(public)/page.tsx`, replace :

```tsx
import { HeroCinematic } from "@/components/HeroCinematic";

<HeroCinematic eyebrow="..." title="..." ... />
```

with :

```tsx
import { HeroVideo } from "@/components/HeroVideo";

<HeroVideo
  videoSrc="/hero/intro.mp4"
  webmSrc="/hero/intro.webm"
  posterSrc="/hero/intro-poster.jpg"
  eyebrow="..."
  title="..."
  ...
/>
```

That's it. The Three.js fallback stays available for any page that wants it.
