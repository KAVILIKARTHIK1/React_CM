# Stage 1: Build React app
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Prepare files for IIS (no server needed)
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build ./build

# Optional: Add a script to serve files via http-server (for testing)
RUN npm install -g http-server
# Expose port
# EXPOSE 3000


# CMD ["http-server", "./build", "-p", "3000", "-c-1", "--fallback", "index.html"]

# CMD ["http-server", "build", "-p", "3000", "-c-1", "-s"]
CMD ["http-server", "build", "-p", "3000", "-c-1", "-s", "-a", "0.0.0.0"]
