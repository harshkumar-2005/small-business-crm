FROM node:22-alpine

WORKDIR /frontend

COPY ./package.json ./package.json

COPY ./package-lock.json ./package-lock.json

RUN npm ci

COPY . .

RUN npm run lint

RUN npm run build

EXPOSE 5173

EXPOSE 4173

CMD ["vite", "preview"]