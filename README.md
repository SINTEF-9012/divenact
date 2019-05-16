# divenact
Diversity-aware fleet management of gateways, based on Azure IoT Hub

# Create cloud resources

Follow [this tutorial](https://docs.microsoft.com/en-us/azure/iot-edge/quickstart-linux) to create an Azure IoT hub and add one (or more) *IoT Edge Devices*. Skip the steps for creating virtual machine (we will use real device) and deploy modules (this is what this tool will do, in a programmatic way).

Remember the following credentials:
- IoT hub connection string
- The edge device's connection string

# Bootstrap edge device

- Upload the [edge/bootstrap] directory the device (Raspberry Pi). 
- Create a empty ```connection.credential``` file, or ```cp connection.credential.bak connection.credential```. Copy the connection string into this file
- ```sudo bash ./setup.sh```

Alternative way:
- SSH into the edge device
- ```bash curl -L https://raw.githubusercontent.com/SINTEF-9012/divenact/master/edge/bootstrap/setup.sh -o setup.sh```
- ```bash echo '<Your device connection string>'>connection.credential```
- ```bash sudo bash ./setup.sh```

# Execute diversity management services

- Go to the [service] foler
- Copy the hub connection string into the ```azureiot.credential``` file
- ```npm install```
- ```tsc```
- ```node create_product.ts```

# Features

## Short term

| id | name | dep | status |
|---|---|---|---|
| 1 | create a deployment| | done |
| 2 | set tag to one device | | done |
| 3 | update a deployment with condition | | |
| 4 | create (or appoint) a production deployment | 1 | done? |
| 5 | create a preview deployment | 1 | |
| 6 | tag _n_ devices to preview | 2 | |
| 7 | a separate daemon to send device info | | hard? |
| 8 | a listener of device info | 7 | |
| 9 | monitor lifecycle of devices | | |
| 10 | keep _n_ devices for preview | 9 | | |
| 11 | move all devices to product | 4, 6 | | |
| 12 | command line UI in node | | |
| 13 | track devices installed on edge | 7 | |
| *14* | shuffle devices among diverse versions | 1, 2 | |