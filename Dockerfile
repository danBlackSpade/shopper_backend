FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g ts-node


COPY . .

EXPOSE 8080

CMD ["ts-node", "src/index.ts"]