FROM node:20-alpine

COPY dist/ /workplace/
COPY package*.json /workplace/
COPY node_modules/ /workplace/node_modules/

WORKDIR /workplace/

EXPOSE 3001
CMD ["node" , "Server.js"]
