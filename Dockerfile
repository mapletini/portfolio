# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_GITHUB_USERNAME
ARG VITE_GITHUB_TOKEN
ENV VITE_GITHUB_USERNAME=$VITE_GITHUB_USERNAME
ENV VITE_GITHUB_TOKEN=$VITE_GITHUB_TOKEN

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
