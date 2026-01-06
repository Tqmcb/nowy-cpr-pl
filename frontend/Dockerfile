# Build stage
FROM node:20 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Set API URL to empty string for relative paths in Nginx
# You can also pass this as a build arg: --build-arg VITE_API_URL=...
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
