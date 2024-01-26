FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3001
EXPOSE 3000
RUN npx prisma generate
RUN chmod +x ./startserver.sh
CMD ["npm", "run","dev"]
