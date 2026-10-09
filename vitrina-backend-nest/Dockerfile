FROM node:20-alpine
RUN apk add --no-cache openssl libssl3
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]
