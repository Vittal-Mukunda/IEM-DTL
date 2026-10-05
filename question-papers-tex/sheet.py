import sys, glob, subprocess, os
from PIL import Image
n=sys.argv[1]; cols=int(sys.argv[2]) if len(sys.argv)>2 else 6
for f in glob.glob('out/v-*.png'): os.remove(f)
subprocess.run(['pdftoppm','-r','40','-png',f'out/{n}.pdf','out/v'])
fs=sorted(glob.glob('out/v-*.png'))
ims=[Image.open(f) for f in fs]
w,h=ims[0].size
rows=(len(ims)+cols-1)//cols
sheet=Image.new('RGB',(w*cols,h*rows),'white')
for i,im in enumerate(ims): sheet.paste(im,((i%cols)*w,(i//cols)*h))
sheet.save('out/sheet.png'); print(sheet.size)
