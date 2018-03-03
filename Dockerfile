FROM node:latest as angular_builder

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

WORKDIR /home/node/app

COPY . .

RUN yarn install

RUN npm run-script build-plugin
