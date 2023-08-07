#!/bin/bash

sudo docker-compose -f docker-compose-dev.yaml down
sudo docker-compose -f docker-compose-dev.yaml up --build --remove-orphans