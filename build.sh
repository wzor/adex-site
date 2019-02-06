#!/usr/bin/env bash

mkdir -p dist
mkdir -p dist/{api,about,early-stage-advisors}
cp -rf public dist/
cp -rf images dist/
cp -rf adex dist

curl http://localhost:4000/ | gunzip > dist/index.html


curl http://localhost:4000/about | gunzip > dist/about/index.html

curl http://localhost:4000/early-stage-advisors | gunzip > dist/early-stage-advisors/index.html

sed -i -e 's/\/about/about\/index.html/g' dist/about/index.html
sed -i -e 's/\/about/about\/index.html/g' dist/index.html

sed -i -e 's/\/early-stage-advisors/early-stage-advisors\/index.html/g' dist/early-stage-advisors/index.html
sed -i -e 's/\/early-stage-advisors/early-stage-advisors\/index.html/g' dist/index.html

sed -i -e 's/\/scripts.js/scripts.js/g' dist/index.html
sed -i -e 's/\/scripts.js/scripts.js/g' dist/about/index.html
sed -i -e 's/\/scripts.js/scripts.js/g' dist/early-stage-advisors/index.html


curl http://localhost:4000/api/transferrable > dist/api/transferrable
curl http://localhost:4000/res.css > dist/res.css
cat scripts/* > dist/scripts.js 
