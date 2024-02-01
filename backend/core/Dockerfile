FROM node:21

WORKDIR /core

COPY package*.json ./

RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]