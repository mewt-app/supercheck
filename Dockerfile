# Use the official Node.js image as the base  
FROM node:20

# Set the working directory inside the container  
WORKDIR /app  

# set env vars
ARG NEXT_JS_AUTH_SECRET
ARG NEXTAUTH_URL
ENV AUTH_SECRET=$NEXT_JS_AUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL 

# Copy package.json and package-lock.json to the container  
COPY package*.json ./  


# Install dependencies 
RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/ && npm config set "//npm.fontawesome.com/:_authToken" FAA7E9F3-D862-438D-A1A6-59E707DC3287 
RUN npm ci  

# Copy the app source code to the container  
COPY . .  

# Expose port 3000
EXPOSE 3000

# Build the Next.js app  
RUN npm run build

# Start the app  
CMD ["npm", "start"]  