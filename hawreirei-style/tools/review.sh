#!/bin/sh
# Contact sheet of stills: ./review.sh 0 8.5 22.1 ...  -> review/sheet.jpg (4 per row)
D=$(cd "$(dirname "$0")" && pwd); LIB=${LIB:-/root/lemo-opuscar}
rm -rf $D/review/s; mkdir -p $D/review/s
cd $LIB && node core/render/still.mjs $D "$@" --size 1080x1920 --out $D/review/s 2>&1 | grep -i "error\|exception" | head -5
cd $D/review && python3 -c "
from PIL import Image; import sys
fs=['s/t_'+a+'.jpg' for a in sys.argv[1:]]; ims=[Image.open(f).resize((360,640)) for f in fs]
S=Image.new('RGB',(360*min(4,len(ims)),640*((len(ims)+3)//4)))
for i,im in enumerate(ims): S.paste(im,((i%4)*360,(i//4)*640))
S.save('sheet.jpg',quality=88)" "$@"
