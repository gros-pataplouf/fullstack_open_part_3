FROM node:18
WORKDIR /app
COPY ../package*.json .
RUN npm install
COPY . /app
EXPOSE 3001
ENTRYPOINT ["npm", "run", "start"]