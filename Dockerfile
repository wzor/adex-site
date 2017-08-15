# Node 6.11 on Debian Jessie
FROM node:argon

# Meta
MAINTAINER Ivo Paunov <paunov@strem.io>
LABEL Description="AdEx Website" Vendor="AdEx Network OÜ" Version="1.0.0"

# Create app directory
RUN mkdir -p /var/www/website

WORKDIR /var/www/website
COPY package.json /var/www/website
RUN npm install --silent --production

WORKDIR /var/www/website
COPY . /var/www/website

EXPOSE 8080
CMD npm start