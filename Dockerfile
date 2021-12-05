FROM node:13

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN npm install\
  && npm install typescript -g

RUN npm ci --production && npm cache clean --force
RUN npm prune --production

RUN npm run build

COPY . .

USER node

CMD ["npm", "start", "--max-old-space-size=450"]