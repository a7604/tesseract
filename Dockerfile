# 🐳 Simple Dockerfile - Think of this as a recipe for your website
# This tells Docker how to package your website

# Step 1: Use Node.js as base (like choosing an operating system)
FROM node:18-alpine

# Step 2: Set working directory (like opening a folder)
WORKDIR /app

# Step 3: Copy package files first (for better caching)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm ci --only=production

# Step 5: Copy your code
COPY . .

# Step 6: Build your website
RUN npm run build

# Step 7: Use a simple web server to serve your files
FROM nginx:alpine

# Step 8: Copy the built website to nginx
COPY --from=0 /app/dist /usr/share/nginx/html

# Step 9: Tell nginx to serve your React app properly
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Step 10: Expose port 80 (the standard web port)
EXPOSE 80

# Step 11: Start nginx
CMD ["nginx", "-g", "daemon off;"]
