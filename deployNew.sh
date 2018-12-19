#!/usr/bin/env bash

USERNAME=$1
HOSTNAME=$2
SCRIPT="rm -rf /var/www/adex && sudo cp -r /home/data/adex-site /var/www/adex && nginx -s reload && exit "

rm -rf dist/*

set -e
./build.sh
rsync -a ./dist/ ${USERNAME}@${HOSTNAME}:/home/data/adex-site/
ssh -l ${USERNAME} ${HOSTNAME} "${SCRIPT}"
