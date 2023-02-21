FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package.json ./
COPY package-lock.json ./
# Install the dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the React project
RUN npm run build

# Use an official NGINX runtime as the base image
FROM nginx:1.19

# Copy the built React project to the default NGINX static files directory
COPY --from=0 /app/dist /usr/share/nginx/html
COPY  nginx.conf /etc/nginx/conf.d/default.conf

# Specify the command to run NGINX
CMD [ "nginx", "-g", "daemon off;" ]
