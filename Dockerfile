FROM node:20-alpine

COPY dist/ /workplace/
COPY package*.json /workplace/

WORKDIR /workplace/

RUN npm install -g pnpm
RUN pnpm import
RUN pnpm install -P

EXPOSE 3001
CMD ["node" , "Server.js"]
