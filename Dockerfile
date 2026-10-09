FROM node:22-alpine
WORKDIR /to-do-backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npx", "nodemon", "app.js" ]