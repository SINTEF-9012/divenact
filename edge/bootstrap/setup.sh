#!/bin/bash

#https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/iot-edge/how-to-install-iot-edge-linux-arm.md 

curl -L https://aka.ms/moby-engine-armhf-latest -o moby_engine.deb
dpkg -i ./moby_engine.deb

curl -L https://aka.ms/moby-cli-armhf-latest -o moby_cli.deb
dpkg -i ./moby_cli.deb


curl -L https://aka.ms/libiothsm-std-linux-armhf-latest -o libiothsm-std.deb
dpkg -i ./libiothsm-std.deb
curl -L https://aka.ms/iotedged-linux-armhf-latest -o iotedge.deb
dpkg -i ./iotedge.deb

apt-get install -f

connection=$(<connection.credential)
# Check the indention
sed -i.bak "s/.*device_connection_string:.*/  device_connection_string: $connection/" /etc/iotedge/config.yaml 

systemctl restart iotedge