import fitz, sys, json, os
NOTES=r"C:\Users\vitta\OneDrive\Desktop\IEM Website\IEM-DTL\iem-website\public\notes"
files=json.load(open(r"C:\Users\vitta\AppData\Local\Temp\claude\C--Users-vitta-OneDrive-Desktop-IEM-Website\93a5504a-57db-4bd7-b8b0-76fbf6f7e0c7\scratchpad\files.json"))
k=sys.argv[1]; a=int(sys.argv[2]) if len(sys.argv)>2 else 1; b=int(sys.argv[3]) if len(sys.argv)>3 else 999
d=fitz.open(os.path.join(NOTES,files[k]))
for i,pg in enumerate(d,1):
    if a<=i<=b: print(f"=== p{i:02d} ===\n"+pg.get_text())
