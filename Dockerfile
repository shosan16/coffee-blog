#############################
# Development Stage
#############################
FROM --platform=linux/amd64 node:20.11.1 AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

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
FROM --platform=linux/amd64 node:20.11.1 AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm pkg delete scripts.prepare && npm ci --omit=dev

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]