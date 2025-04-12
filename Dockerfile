#############################
# Development Stage
#############################
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (開発用含む)
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]

#############################
# Production Stage
#############################
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the production server（本番用コマンド）
CMD ["npm", "start"]