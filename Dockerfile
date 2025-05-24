# Use official Node.js Alpine 
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install netcat-openbsd (for wait-for-mysql.sh)
RUN apk add --no-cache netcat-openbsd

# Copy the rest of the source code
COPY . .

# Give execution permission to wait script
RUN chmod +x ./wait-for-mysql.sh

# Run app after waiting for MySQL
CMD ["./wait-for-mysql.sh", "npm", "run", "dev"]