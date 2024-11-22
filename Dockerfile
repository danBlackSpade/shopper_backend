FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY . .

RUN npm run build

# RUN npm run build && ls -la

# FROM node:20-alpine

# WORKDIR /app

# COPY --from=builder /app/dist ./dist
# COPY package*.json ./
# RUN npm install --production

EXPOSE 8080
#test

CMD ["sh", "-c", "npm run seed && npm start"]
