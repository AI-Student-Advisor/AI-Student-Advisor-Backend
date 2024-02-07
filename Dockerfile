FROM node:21

COPY "dist/" /workplace/
COPY "public/" /workplace/
COPY package*.json /workplace/
COPY .env /workplace/
COPY tsconfig.json /workplace/

WORKDIR /workplace/

RUN npm install

EXPOSE 3001
CMD ["npm" , "run", "startServer"]