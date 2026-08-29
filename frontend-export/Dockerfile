FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS dev
WORKDIR /app
ENV NODE_ENV=development
ENV HOSTNAME=0.0.0.0
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev", "--", "-p", "3001"]

FROM node:22-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL=https://dks.com.pl
ARG NEXT_PUBLIC_DIRECTUS_URL=https://dks.pl/backend
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_RECAPTCHA_BYPASS_LOCAL=false
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_DIRECTUS_URL=$NEXT_PUBLIC_DIRECTUS_URL
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_RECAPTCHA_BYPASS_LOCAL=$NEXT_PUBLIC_RECAPTCHA_BYPASS_LOCAL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3001
CMD ["node", "server.js"]
