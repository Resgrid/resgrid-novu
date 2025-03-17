# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

ENV NOVU_SECRET_KEY=NOVU_SECRET_KEY
ENV NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER=NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER
ENV NEXT_PUBLIC_NOVU_SUBSCRIBER_ID=NEXT_PUBLIC_NOVU_SUBSCRIBER_ID
ENV NOVU_API_URL=NOVU_API_URL

COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS production
WORKDIR /app

ENV NOVU_SECRET_KEY=NOVU_SECRET_KEY
ENV NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER=NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER
ENV NEXT_PUBLIC_NOVU_SUBSCRIBER_ID=NEXT_PUBLIC_NOVU_SUBSCRIBER_ID
ENV NOVU_API_URL=NOVU_API_URL

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install --production
CMD ["npm", "start"]
EXPOSE 3000