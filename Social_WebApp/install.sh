#!/bin/bash
sudo apt-get update -y

sudo apt-get install -y nodejs npm node-ejs
sudo apt-get install -y wget
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

sudo apt update -y

sudo apt install -y mongodb-org

sudo systemctl start mongod

sudo systemctl enable mongod