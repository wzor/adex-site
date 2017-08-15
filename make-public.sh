#!/usr/bin/env bash

if [ ! -d $1 ];
then
	echo "dir does not exist: $1"
fi

cp -rf ./{adex,public} $1
curl http://localhost:4000/ | zcat > $1/index.html
curl http://localhost:4000/tokens | zcat > $1/tokens.html
curl http://localhost:4000/res.css > $1/res.css
