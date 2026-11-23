#!/bin/sh
# Start a new film from the house-style template.
# Usage: sh hawreirei-style/tools/new_film.sh /home/claude/<slug>
set -e
HERE=$(cd "$(dirname "$0")/.." && pwd); DST=$1
[ -z "$DST" ] && { echo "usage: new_film.sh <film dir>"; exit 1; }
[ -e "$DST" ] && { echo "$DST already exists"; exit 1; }
cp -r "$HERE/template" "$DST"
rm -f "$DST/vo/el/align.json" "$DST/vo/el/env.json" "$DST/vo/el/lines.txt"
mkdir -p "$DST/out" "$DST/review"
cp "$HERE/tools/review.sh" "$DST/review.sh"; chmod +x "$DST/review.sh"
echo "new film at $DST (film.js is the KPK example: rewrite its story, keep the style blocks)"
