FROM node:18 AS build

WORKDIR /build

COPY . .

RUN npm install
RUN npm run build --prod


FROM nginx:latest
# Copying compiled code and nginx config to different folder
# NOTE: This path may change according to your project's output folder
COPY --from=build /build/dist/rboit-front /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
