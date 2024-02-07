FROM node:20-alpine

COPY dist/ /workplace/
COPY package*.json /workplace/

WORKDIR /workplace/

RUN npm install --omit=dev

EXPOSE 3001
CMD ["node" , "Server.js"]
