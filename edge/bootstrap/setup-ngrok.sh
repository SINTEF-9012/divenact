#!/bin/bash

curl -O https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-arm.zip
unzip ngrok-stable-linux-arm.zip
sudo cp ./ngrok /opt/
/opt/ngrok authtoken $(<ngrok.credential)

sudo cp ./ngrokssh.service /etc/systemd/system/ngrokssh.service
sudo sudo chmod 644 /etc/systemd/system/ngrokssh.service
sudo systemctl enable ngrokssh