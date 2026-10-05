import json, os, shutil, sys, subprocess
NOTES=r"C:\Users\vitta\OneDrive\Desktop\IEM Website\IEM-DTL\iem-website\public\notes"
BK=r"C:\Users\vitta\OneDrive\Desktop\IEM Website\IEM-DTL\question-papers-tex\originals"
files=json.load(open(r"C:\Users\vitta\AppData\Local\Temp\claude\C--Users-vitta-OneDrive-Desktop-IEM-Website\93a5504a-57db-4bd7-b8b0-76fbf6f7e0c7\scratchpad\files.json"))
# usage: deploy.py <texname> <key> [<key> ...]   (extra keys receive a copy too)
tex=sys.argv[1]
for k in sys.argv[2:]:
    dst=os.path.join(NOTES,files[k]); bk=os.path.join(BK,files[k])
    if not os.path.exists(bk):
        os.makedirs(os.path.dirname(bk),exist_ok=True); shutil.copy2(dst,bk)
    shutil.copy2(os.path.join("out",tex+".pdf"),dst)
    print("deployed",k,"->",files[k],os.path.getsize(dst)//1024,"KB")
