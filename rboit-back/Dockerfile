FROM node:18 as builder

WORKDIR /builder

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:18

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY --from=builder /builder/dist ./dist

CMD [ "npm", "run", "start" ]
