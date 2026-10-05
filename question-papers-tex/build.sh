#!/bin/bash
# usage: ./build.sh <name> [maxerrlines]  -- compiles twice (longtable/page refs need 2 passes)
cd "$(dirname "$0")"
n=$1
xelatex -interaction=nonstopmode -output-directory=out $n.tex > out/$n.buildlog 2>&1
xelatex -interaction=nonstopmode -output-directory=out $n.tex > out/$n.buildlog 2>&1
grep -n -A5 '^!' out/$n.buildlog | head -${2:-30}
pdfinfo out/$n.pdf 2>/dev/null | grep Pages
