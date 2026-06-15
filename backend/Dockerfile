# backend/Dockerfile
FROM node:22-bookworm-slim

WORKDIR /directus
ENV TZ=Europe/Warsaw

# narzędzia pod natywne moduły
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    python3 \
    make \
    g++ \
    pkg-config \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# najpierw manifesty, żeby lepiej działał cache
COPY package.json package-lock.json* ./

# instalacja zależności
# npm ci tylko gdy lock istnieje i jest zgodny
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# reszta kodu
COPY . .

# runtime dirs + prawa
RUN mkdir -p /directus/uploads /directus/.cache /directus/.temp \
  && chown -R node:node /directus

ENV NODE_ENV=production
ENV LOG_LEVEL=warn
ENV LOG_STYLE=raw

EXPOSE 8055
USER node

# start directusa
CMD ["npx", "--no-install", "directus", "start"]