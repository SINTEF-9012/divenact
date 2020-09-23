#!/bin/bash

curl -O https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-arm.zip
unzip ngrok-stable-linux-arm.zip
sudo cp ./ngrok /opt/
/opt/ngrok authtoken $(<ngrok.credential)

sudo cp ngrok-ssh /etc/init.d/
sudo chmod a+x /etc/init.d/ngrok-ssh