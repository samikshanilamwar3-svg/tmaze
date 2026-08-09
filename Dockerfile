FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ARG VITE_TVMAZE_API_BASE_URL=https://api.tvmaze.com
ENV VITE_TVMAZE_API_BASE_URL=${VITE_TVMAZE_API_BASE_URL}

RUN yarn build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
