# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy root package.json and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy client package.json and install dependencies
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm ci
RUN chmod -R +x node_modules/react-scripts/bin/

# Copy all files
WORKDIR /app
COPY . .

# Build the client
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]