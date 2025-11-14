# Multi-stage build for Railway deployment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for both root and client
COPY package*.json ./
COPY client/package*.json ./client/

# Install root dependencies
RUN npm ci --only=production

# Copy client directory and install client dependencies
COPY client ./client
RUN cd client && npm install

# Copy all source files
COPY . .

# Build the React client
RUN npm run railway-build

# Expose port
EXPOSE 10000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]