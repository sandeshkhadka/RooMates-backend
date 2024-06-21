# RooMates
Backend for [Roommates](https://github.com/sandeshkhadka/RooMates-Frontend) written in Nodejs (Express)

## Requirements
    - node@18.17.1 
    - prisma

## Installation

### From source
1. Clone and install dependencies
```bash
git clone git@github.com:sandeshkhadka/RooMates-backend.git
cd RooMates-backend
npm install
```
2. Setup environment variables
```bash
cp .env.example .env
vim .env
```
3. Start server
```bash
npm run dev
```
***Make sure you have your database running before staring the server***

### Using docker

Below is example how you can use docker with database within same network:
Set DATABASE_URL environment variable within .env file as below: 
`DATABASE_URL=postgresql://postgres:<POSTGRES_PASSWORD>@roommates:5432/roommates`
*** You can skip setting up docker network postgresql container if you are using external databse***
```bash
sudo docker run -d \
        --name roommates \
        -e POSTGRES_PASSWORD=PASSWORD \
        -e PGDATA=/var/lib/postgresql/data/pgdata \
        -v ~/.docker/volumes/postgres:/var/lib/postgresql/data \
        -p 5432:5432 --network roommates_network postgres

docker run -p 3000:3000 --network roommates_network --env-file ./.env sandeshkhadka/roommates-backend:latest
```
## Docs: Refer to [wiki](https://github.com/sandeshkhadka/RooMates-backend/wiki) for documentation on api and routes

