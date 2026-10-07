#!/usr/bin/env bash
# Regenerates optimized media in src/assets/media/ from the originals in
# media-src/ (kept out of the bundle). Needs ffmpeg (libaom, libx264,
# libvpx-vp9) and cwebp. Outputs are committed; rerun after changing a source.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
SRC=media-src
OUT=src/assets/media
mkdir -p "$OUT"

# Photos: AVIF + WebP at each width, plus a JPEG fallback at the largest.
photo() { # name source widths...
  local name=$1 source=$2; shift 2
  for w in "$@"; do
    ffmpeg -loglevel error -y -i "$source" -vf "scale=$w:-2" -c:v libaom-av1 -still-picture 1 -crf 32 -cpu-used 4 "$OUT/$name-$w.avif"
    cwebp -quiet -q 78 -resize "$w" 0 "$source" -o "$OUT/$name-$w.webp"
  done
  local largest=${!#}
  ffmpeg -loglevel error -y -i "$source" -vf "scale=$largest:-2" -q:v 4 "$OUT/$name-$largest.jpg"
}
photo me-at-magens "$SRC/me_at_magens.jpg" 480 800 1200
photo beta-classroom "$SRC/beta_classroom.jpg" 600
# Transparent PNG: WebP keeps alpha; the fallback stays PNG. (ffmpeg's AVIF
# path here would drop the alpha channel.)
cwebp -quiet -q 80 -alpha_q 90 -resize 650 0 "$SRC/beta_laptop.png" -o "$OUT/beta-laptop-650.webp"
cp "$SRC/beta_laptop.png" "$OUT/beta-laptop-650.png"
photo beta-level-design "$SRC/beta_paper_level_design.png" 600

# GIFs → muted looping video (H.264 for Safari, VP9 for the rest) + poster.
for name in woo-1 woo-4 woo-5 woo-6; do
  ffmpeg -loglevel error -y -i "$SRC/$name.gif" -movflags +faststart -pix_fmt yuv420p \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 28 -preset slow -an "$OUT/$name.mp4"
  ffmpeg -loglevel error -y -i "$SRC/$name.gif" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    -c:v libvpx-vp9 -crf 38 -b:v 0 -an "$OUT/$name.webm"
  ffmpeg -loglevel error -y -i "$SRC/$name.gif" -frames:v 1 -c:v libwebp -q:v 75 "$OUT/$name-poster.webp"
done
# Tech icons: shown at ~84 px in the tour's marquees; 200 px covers 2x screens.
for icon in "$SRC"/tech_icons/*.png; do
  cwebp -quiet -q 82 -alpha_q 90 -resize 200 0 "$icon" -o "public/tech_icons/$(basename "$icon" .png).webp"
done

ls -la "$OUT"
