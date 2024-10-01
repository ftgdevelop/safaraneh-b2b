FROM node:alpine
  
COPY . /app

WORKDIR /app

CMD "yarn start -p 2091"