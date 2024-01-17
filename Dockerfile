FROM node:21.4-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node --require dd-trace/init", "tasks-app.js" ]