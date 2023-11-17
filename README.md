# News Service

A service to manage the news database and provide a news feed to the user

## Requirements
- Docker
- Docker compose
- NodeJS

## Installation

# Clone the repository
`git clone https://github.com/your_username/your_project.git`

# Install dependencies
`npm install`

# Usage

## If you want just try the API you can run the docker-compose with the follow command

Build the API Image

`docker build -t news-service .`

Run API with docker compose

`docker-compose up`

You will be able to see the documentation on 
http://localhost:3000/api-docs/

## For development propouses you can run redis and MongoDB with docker:

MongoDB

`docker run --name mongodb-container -p 27017:27017 -d mongo`

Redis

`docker run --name redis-container -p 6379:6379 -d redis`

Then you can run `npm start` to start the API.

### In development mode you can run unit test

`npm test`

### If you already have a in cloud redis or mongoDB instance

You can configurate the host and ports in the `/config/[envirorment].js` files

## To load some news to try the API

You can use the `POST /articles/load` endpoint. It will add 20 new articles to the DB. The endpoit simulate the daily load from sources.

## To create a new user to test the favorites feature

You can use the `POST /users` endpoint, including a JSON body with a `name` string attribute to create a user and get its ID. The endpoit simulate the user sign in.


# Documentation
You can find all related documentation [Here](https://docs.google.com/document/d/1lT30NkH9vlRoNO-IXAXJGxqL5RezCeGe3GOKPOjlmoI/edit?usp=sharing)