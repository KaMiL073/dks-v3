# int/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Najpierw kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Następnie kopiujemy pozostały kod aplikacji
COPY . .

# Domyślny port Next.js
EXPOSE 3000

# Uruchamiamy Next.js w trybie dev
CMD ["npm", "run", "dev"]