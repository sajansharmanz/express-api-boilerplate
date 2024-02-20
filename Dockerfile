FROM node:20.11.1-alpine3.19 as base

RUN apk --no-cache -U upgrade

WORKDIR /app

COPY ./package*.json ./

RUN npm clean-install

COPY . .

RUN npm run prisma:generate

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "./dist/src/index.js"]