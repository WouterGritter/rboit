FROM node:18 AS builder

WORKDIR /build

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build --prod

FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --production

COPY --from=builder /build/dist ./dist

CMD [ "npm", "run", "start" ]
