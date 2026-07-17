# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# NOTE: Vite inlines VITE_* env vars into the static bundle at BUILD time,
# not at container runtime. So VITE_API_URL must be present during
# `npm run build`. Dokploy passes it via "Build Args" (not runtime Env).
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine AS serve
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
