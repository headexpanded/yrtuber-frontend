# Use Node 20 Alpine as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install global Quasar CLI
RUN npm install -g @quasar/cli

# Copy and install dependencies
COPY . .
RUN npm install

# Expose dev server port
EXPOSE 9000

# Default command for dev server
CMD ["quasar", "dev"]
