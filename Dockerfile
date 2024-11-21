FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
# RUN npm install -g ts-node
# RUN npm install --save-dev typescript ts-node



COPY . .

RUN npm run build

EXPOSE 8080
#test


# CMD ["ts-node", "src/index.ts", "sh", "-c", "npm run seed && npm start"]
CMD npm run seed && npm start
