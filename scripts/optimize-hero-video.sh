#!/usr/bin/env bash
# Optimize a raw cinematic video for web hero use.
# Produces: intro.mp4 (H.264), intro.webm (VP9), intro-poster.jpg (last frame).
#
# Usage : bash scripts/optimize-hero-video.sh /path/to/raw.mov

set -euo pipefail

SRC="${1:-}"

if [ -z "$SRC" ] || [ ! -f "$SRC" ]; then
  echo "Usage: bash scripts/optimize-hero-video.sh <path-to-source-video>"
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg not installed. Run 'brew install ffmpeg' first."
  exit 1
fi

OUT_DIR="public/hero"
mkdir -p "$OUT_DIR"

echo "→ Encoding H.264 1080p web-optimized…"
ffmpeg -y -i "$SRC" \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#100609" \
  -c:v libx264 \
  -profile:v high \
  -preset slow \
  -crf 23 \
  -movflags +faststart \
  -an \
  "$OUT_DIR/intro.mp4"

echo "→ Encoding VP9 1080p (smaller for compatible browsers)…"
ffmpeg -y -i "$SRC" \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#100609" \
  -c:v libvpx-vp9 \
  -b:v 1500k \
  -crf 32 \
  -row-mt 1 \
  -an \
  "$OUT_DIR/intro.webm"

echo "→ Generating poster (last frame)…"
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$SRC")
LAST_FRAME=$(echo "$DURATION - 0.1" | bc)
ffmpeg -y -ss "$LAST_FRAME" -i "$SRC" \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease" \
  -vframes 1 \
  -q:v 4 \
  "$OUT_DIR/intro-poster.jpg"

echo ""
echo "✓ Done. Files in $OUT_DIR:"
ls -lh "$OUT_DIR" | grep "intro"
echo ""
echo "Next steps:"
echo "  1. Verify intro.mp4 is under 8 MB"
echo "  2. Switch home hero from HeroCinematic to HeroVideo (see public/hero/README.md)"
echo "  3. git add public/hero && git commit && git push"
