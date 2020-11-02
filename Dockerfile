FROM node:12-alpine AS builder

RUN apk add --no-cache git

WORKDIR /temp/server

COPY . .

RUN npm install

RUN npm run build

RUN rm -rf ./node_modules

RUN JOBS=MAX npm i --production

FROM node:12-alpine

RUN apk add ca-certificates

COPY --from=builder /temp/server/build/ /temp/server/reset-port.sh /temp/server/node_modules  /app/

WORKDIR /app

EXPOSE 8080

CMD [ "node", "./src/main.js" ]