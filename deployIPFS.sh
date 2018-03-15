#!/usr/bin/env bash


rm -rf dist/*

set -e
./build.sh
ipfs add -r dist
