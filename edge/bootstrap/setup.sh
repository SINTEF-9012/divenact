#!/bin/bash

#https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge-linux

# Use Docker instead of Moby
curl -sSL https://get.docker.com | sh

# Install iotedge
curl https://packages.microsoft.com/config/debian/stretch/multiarch/prod.list > ./microsoft-prod.list
sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/

sudo apt-get update
sudo apt-get install -y iotedge


connection=$(<connection.credential)
# Check the indention
sudo sed -i.bak "s@.*device_connection_string:.*@  device_connection_string: $connection@" /etc/iotedge/config.yaml 

sudo systemctl restart iotedge

# Enable Docker remote engine
sudo mkdir -p /etc/systemd/system/docker.service.d/
sudo echo "[Service]\nExecStart=\nExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2376 -H unix:///var/run/docker.sock" > /etc/systemd/system/docker.service.d/startup_options.conf

sudo systemctl daemon-reload
sudo systemctl restart docker.service