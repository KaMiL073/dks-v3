FROM node:20-alpine

# Ustaw katalog roboczy
WORKDIR /app

# Zainstaluj git (jeśli potrzebujesz np. do instalacji paczek z repo)
RUN apk add --no-cache git

# Skopiuj package.json i package-lock.json
COPY package*.json ./

# Instalacja dependencies (dev + prod)
RUN npm install

# Skopiuj cały kod do kontenera
COPY . .

# Domyślne polecenie - tryb dev (hot reload)
CMD ["npm", "run", "dev"]