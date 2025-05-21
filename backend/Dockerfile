# Use Node base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy source and config
COPY . .

# Build the TypeScript code
RUN npm run build

# Run the app from compiled output
CMD ["node", "dist/index.js"]
