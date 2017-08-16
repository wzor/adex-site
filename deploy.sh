#!/usr/bin/env bash

USERNAME=$1
HOSTNAME=$2
SCRIPT="cd ~/adex-site && git checkout master && git pull && npm install --production && pm2 restart adex-site && exit && exit && exit"
ssh -l ${USERNAME} ${HOSTNAME} "${SCRIPT}"