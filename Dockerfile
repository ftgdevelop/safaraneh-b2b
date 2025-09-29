FROM node:20-alpine
COPY . /app
WORKDIR /app
CMD "yarn start -p 2092"
