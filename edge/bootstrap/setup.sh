#!/bin/bash

#https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge-linux

curl https://packages.microsoft.com/config/debian/stretch/multiarch/prod.list > ./microsoft-prod.list
sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
sudo apt-get update
sudo apt-get install -y moby-engine
sudo apt-get install -y moby-cli

sudo apt-get update
sudo apt-get install -y iotedge


connection=$(<connection.credential)
# Check the indention
sed -i.bak "s@.*device_connection_string:.*@  device_connection_string: $connection@" /etc/iotedge/config.yaml 

systemctl restart iotedge