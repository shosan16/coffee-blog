#############################
# Development Stage
#############################
FROM --platform=linux/amd64 node:20.11.1-alpine3.19 AS development

WORKDIR /app

# Alpine Linuxで必要なパッケージをインストール
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Clear npm cache and install dependencies for Linux platform
RUN npm cache clean --force && \
    npm ci --platform=linux --arch=x64

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port 3000
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]

#############################
# Production Stage
#############################
FROM --platform=linux/amd64 node:20.11.1-alpine3.19 AS production

WORKDIR /app

# Alpine Linuxで必要なパッケージをインストール
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install only production dependencies and skip husky install
RUN npm pkg delete scripts.prepare && npm ci --omit=dev

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the production server(本番用コマンド)
CMD ["npm", "start"]