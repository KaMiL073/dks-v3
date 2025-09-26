FROM node:20-alpine AS builder

RUN apk add --no-cache git
WORKDIR /directus
COPY package*.json ./

# Install all deps to build extensions
RUN npm install

# Copy full code
COPY . .

# Build extensions (Directus CLI)
RUN npx directus extensions build

#
# Final image
#
FROM node:20-alpine
WORKDIR /directus
ENV TZ='Europe/Warsaw'

# Copy node_modules and built extensions
COPY --from=builder --chown=node:node /directus/node_modules ./node_modules
COPY --from=builder --chown=node:node /directus/extensions/.registry ./extensions/.registry
COPY --from=builder --chown=node:node /directus ./

ENV NODE_ENV=production \
    LOG_LEVEL=warn \
    LOG_STYLE=raw

EXPOSE 8055

RUN chmod +x ./dev/start.sh ./dev/start_dev.sh
USER node
ENTRYPOINT ["./dev/start.sh"]