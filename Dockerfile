### STAGE 1: Compile ###
FROM node:10 as angular_builder
ARG build=0

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

WORKDIR /home/node/app

COPY . .

RUN yarn install

RUN npm run-script pre-build --BUILD=$build
RUN npm run-script build-plugin

### STAGE 2: Upload sourcemaps ###

FROM getsentry/sentry-cli
ARG sentry=""
ARG build=0

COPY --from=angular_builder /home/node/app/dist/* /work/

RUN export SENTRY_AUTH_TOKEN=$sentry

RUN sentry-cli --auth-token $sentry releases -o mypet new -p skilltree-creator PLUGIN-3.0-b$build
RUN sentry-cli --auth-token $sentry releases -o mypet -p skilltree-creator files PLUGIN-3.0-b$build upload-sourcemaps --ext map /work
RUN sentry-cli --auth-token $sentry releases -o mypet -p skilltree-creator finalize PLUGIN-3.0-b$build
