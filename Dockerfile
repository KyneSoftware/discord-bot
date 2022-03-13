FROM node:13 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN ls -la
RUN ls -la ./dist

FROM node:13 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG GITHUB_SHA=local
ENV GITHUB_SHA=${GITHUB_SHA}

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --production && npm cache clean --force
RUN npm prune --production

COPY --from=development /usr/src/app/dist/ /usr/src/app/dist/

USER node

RUN ls ./dist

CMD ["node", "./dist/index.js", "--max-old-space-size=450"]