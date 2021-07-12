# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install

# Generate the build of the application
# RUN npm run ng build -- --configuration=production
RUN npm run build-prod

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/fleet-front /usr/share/nginx/html
COPY --from=build /usr/local/app/nginx.conf /etc/nginx/nginx.conf
