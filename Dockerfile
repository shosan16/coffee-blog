#############################
# Development Stage
#############################
FROM node:20.11.1-alpine3.19 AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (開発用含む)
RUN npm install

# Copy the rest of the application
COPY . .

# .nextディレクトリの権限設定
RUN mkdir -p .next && chown -R node:node .next

# nodeユーザーに切り替え
USER node

# Expose port 3000
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]

#############################
# Production Stage
#############################
FROM node:20.11.1-alpine3.19 AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies and skip husky install
RUN npm pkg delete scripts.prepare && npm install --omit=dev

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the production server（本番用コマンド）
CMD ["npm", "start"]