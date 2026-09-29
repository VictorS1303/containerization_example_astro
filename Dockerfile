### PREVIOUS VERSION ###

# FROM node:22

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# RUN npm run build

# EXPOSE 4321

# ENV HOST=0.0.0.0
# ENV PORT=4321

# CMD ["node", "./dist/server/entry.mjs"]


### CLEANER VERSION ###

FROM node:22 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:22 AS runtime

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

USER node

EXPOSE 4321

ENV HOST=0.0.0.0
ENV PORT=4321

CMD ["node", "./dist/server/entry.mjs"]