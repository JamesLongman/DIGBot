FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY ormconfig.js .
COPY --from=0 /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
