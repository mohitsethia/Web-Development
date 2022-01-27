# Xmeme By Mohit Sethia

This is a simple CRUD API to post memes
Frontend and Backend are not separated for this project

Link: https://calm-woodland-31742.herokuapp.com/

Tech Stack used: 
	Front-end: EJS, CSS, Javascript
	Back-end: NodeJs, Express
	Database: MySQL

## Installation

```bash
sudo apt-get update
```
```bash
sudo apt-get install nodejs
```
```bash
sudo apt-get install 
```
## Run the app
```bash
node app.js
```
## Run the tests
    ./test_server.sh

# REST API
The REST API to the example app is described below.
## Get list of Things
### Request
`GET /memes/` \
    `curl --location --request GET 'http://localhost:8081/memes'`
### Response
	http/1.1 200 OK
    Content-Type: application/json; charset=utf-8
    Content-Length: 2
    []

## Create a new Thing
### Request
`POST /memes/` 
	`curl --location --request POST 'http://<Server_URL>/memes' 
	--header 'Content-Type: application/json' 
	--data-raw '{
		"name": "ashok kumar",
		"url": "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg",
		"caption": "This is a meme"
	}'`

### Response
	http/1.1 201 Success
    {"id":1}

## Posting existing Thing
`POST /memes/`
	`curl --location --request POST 'http://<Server_URL>/memes' 
	--header 'Content-Type: application/json' 
	--data-raw '{
		"name": "ashok kumar",
		"url": "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg",
		"caption": "This is a meme"
	}'`

### Response
	HTTP/1.1 409
	{"status":409, "reason":"Conflict"}

## Get a specific Thing
### Request
`GET /memes/<id>`
    curl --location --request GET 'http://localhost:8081/memes/1'
### Response
    content-length: 130 
    content-type: application/json; charset=utf-8 
    {
        "id": 1,
        "name": "ashok kumar",
        "url": "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg",
        "caption": "This is a meme"
    }
## Get a non-existent Thing
### Request
`GET /memes/<id>`
    curl --location --request GET 'http://localhost:8081/memes/2'
### Response
    HTTP/1.1 404 Not Found
    content-length: 9 
    content-type: text/plain; charset=utf-8 
    {"status":404,"reason":"Not found"}

## Update a Thing's state
### Request
`PATCH /memes/<id>`
    curl --location --request PATCH 'http://localhost:8081/memes/1' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "url": "https://picsum.photos/536/354",
    "caption": "Lorem Ipsum Image"
    }'
### Response
    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 40
    {"id":1,"name":"Foo","status":"changed"}
## Patch a non-existent Thing
### Request
`PATCH /memes/<id>`
    curl --location --request PATCH 'http://localhost:8081/memes/9999' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "url": "https://picsum.photos/536/354",
    "caption": "Lorem Ipsum Image"
    }'
### Response
    HTTP/1.1 404 Not Found
    content-length: 9 
    content-type: text/plain; charset=utf-8 
    {"status":404,"reason":"Not found"}