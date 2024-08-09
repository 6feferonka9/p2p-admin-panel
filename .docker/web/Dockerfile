FROM imbios/bun-node:1-20-alpine as base

WORKDIR /app

COPY package.json bun.lockb bunfig.toml ./

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

#RUN touch .env
#RUN echo NODE_ENV="$NODE_ENV" >> .env

RUN bun install

FROM imbios/bun-node:1-20-alpine as build

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
#COPY --from=base /app/.env ./.env
COPY . .

ARG API
ENV API $API

#RUN echo API="$API" >> .env

RUN bun run build

FROM imbios/bun-node:1-20-alpine as web

WORKDIR /app

ARG API
ARG NODE_ENV

ENV API $API
ENV NODE_ENV $NODE_ENV

RUN addgroup -g 1111 -S nodejs
RUN adduser -S remix -u 1111

RUN mkdir ./logs
RUN chown -R remix:nodejs ./logs
RUN apk add --update curl && rm -rf /var/cache/apk/*

USER remix

COPY --from=build /app/public ./public
COPY --from=build --chown=remix:nodejs /app/build ./build
#COPY --from=build /app/.env ./.env
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME 0.0.0.0

CMD ["bun", "start"]
