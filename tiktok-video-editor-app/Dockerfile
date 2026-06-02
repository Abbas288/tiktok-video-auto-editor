FROM node:22-bookworm-slim AS build

WORKDIR /app

ARG EXPO_PUBLIC_COMPILE_SERVER_URL=/api
ENV EXPO_PUBLIC_COMPILE_SERVER_URL=$EXPO_PUBLIC_COMPILE_SERVER_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build:web

FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]