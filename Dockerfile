FROM node:12.18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:12.18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --production && npm cache clean --force
RUN npm prune --production

COPY . .
COPY --from=development /usr/src/app/dist ./dist

USER node

CMD ["node", "dist/index.js", "--max-old-space-size=450"]