FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Set environment variable for database path (can be overridden at runtime)
ENV DB_PATH=/app/treasure_hunt.db

# Expose the port the app runs on
EXPOSE 3123

# Command to run the application
CMD ["node", "server.js"]