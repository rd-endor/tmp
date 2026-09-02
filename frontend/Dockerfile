# Stage 1: Build the React Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies using official public registry
COPY package.json ./
RUN npm install --registry=https://registry.npmjs.org/

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine

# Copy built frontend assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
