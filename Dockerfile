FROM node:18.17.1-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3001
EXPOSE 3000
RUN npx prisma generate
RUN npm install -g nodemon
RUN chmod +x ./startserver.sh
CMD ["sh","./startserver.sh"]
