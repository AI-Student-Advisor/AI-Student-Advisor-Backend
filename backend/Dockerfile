FROM node:21

WORKDIR /backend

COPY package*.json ./

RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]