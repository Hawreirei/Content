#!/bin/sh
# Bangun ulang seluruh film: gambar → event → suara (skor, foley, dan rekaman suara bila ada) → mux −14 LUFS → srt
# Butuh: Node 20+ dengan Playwright, ffmpeg, Python 3 dengan numpy, scipy, soundfile
set -e
cd "$(dirname "$0")"
mkdir -p out voices
[ -n "$(ls voices/*.wav 2>/dev/null)" ] && python3 tools/voice_prep.py
node tools/render.mjs --workers 4
node tools/still.mjs 0.6 --events
python3 audio.py
sh tools/mux.sh out/video.mp4 out/mix.wav nusa-wacana-ep1.mp4
python3 tools/srt.py
cp review/t_0.6.jpg poster.jpg
