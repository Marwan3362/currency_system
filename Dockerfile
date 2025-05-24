# Use official Node.js Alpine 
FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN apk add --no-cache netcat-openbsd

COPY . .

RUN chmod +x ./wait-for-mysql.sh

EXPOSE 3000

CMD ["./wait-for-mysql.sh", "containers-us-west-123.railway.app", "3306", "npm", "run", "dev"]
