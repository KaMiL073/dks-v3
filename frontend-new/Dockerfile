FROM node:20-alpine AS builder

# Zainstaluj git
RUN apk add --no-cache git

# Ustaw katalog roboczy
WORKDIR /directus

# Skopiuj package.json i package-lock.json
COPY package*.json ./

# Zmień właściciela katalogu na node
RUN chown -R node:node /directus

# Przełącz się na użytkownika node
USER node

# Instalacja dependencies (dev + prod)
RUN npm install

# Skopiuj cały kod i ustaw właściciela na node
COPY --chown=node:node . .

# Build, jeśli masz np. TypeScript w extensions
CMD ["npm", "run", "dev"]