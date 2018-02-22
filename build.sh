mkdir -p dist
mkdir -p dist/api
cp -rf public dist/
cp -rf adex dist

curl http://localhost:4000/ | gunzip > dist/index.html
curl http://localhost:4000/api/transferrable > dist/api/transferrable
curl http://localhost:4000/res.css > dist/res.css
cat scripts/* > dist/scripts.js 
