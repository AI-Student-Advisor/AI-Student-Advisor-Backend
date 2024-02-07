FROM node:21

COPY "dist/" /workplace/
COPY package*.json /workplace/
COPY .env /workplace/

WORKDIR /workplace/

RUN npm install --force

EXPOSE 3001
CMD ["npm" , "run", "startServer"]