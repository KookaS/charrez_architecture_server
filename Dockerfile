FROM node:12-alpine AS builder

RUN apk update && apk add yarn curl bash && apk add --no-cache git

RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

# run node prune
RUN /usr/local/bin/node-prune

#display unused dependencies
RUN du -sh ./node_modules/* | sort -nr | grep '\dM.*'



FROM node:12-alpine

RUN apk --no-cache add ca-certificates

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/reset-port.sh  ./

COPY --from=builder /usr/src/app/build/  ./build/

COPY --from=builder /usr/src/app/node_modules  ./node_modules

EXPOSE 8080

CMD [ "node", "build/src/main.js" ]