# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the app files to the container
COPY . .

# Specify the command to run the app
CMD ["npm", "start"]
