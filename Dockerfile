FROM node:latest as angular_builder

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

WORKDIR /home/node/app

COPY . .

RUN ls -al

RUN yarn install

RUN npm run-script ng build --prod --env=plugin.prod
