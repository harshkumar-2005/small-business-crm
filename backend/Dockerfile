FROM node:20-alpine

WORKDIR /backend

COPY ./package.json ./package.json

COPY ./package-lock.json ./package-lock.json

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/index.js"]