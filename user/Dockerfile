FROM node:12.14.1-alpine3.11

WORKDIR /usr/app

COPY package*.json ./

RUN yarn

COPY . .
