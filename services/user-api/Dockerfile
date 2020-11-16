FROM node:15.2.0-alpine3.10

WORKDIR /usr/src/api

COPY ./package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD yarn start