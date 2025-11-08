# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Set build arguments as environment variables for Vite
ENV VITE_BASE_URL=http://localhost:3000/api

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine
WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the preview server will run on
EXPOSE 4173

# Command to run the preview server
CMD ["npm", "run", "preview", "--", "--host"]
