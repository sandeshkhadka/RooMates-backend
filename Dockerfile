FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3001
EXPOSE 3000
RUN npx prisma generate
RUN chmod +x ./startserver.sh
ENV PORT $PORT
ENV SOCKET_PORT $SOCKET_PORT
ENV DATABASE_URL $DATABASE_URL
ENV JWT_SECRET $JWT_SECRET
CMD ["npm", "run","dev"]
