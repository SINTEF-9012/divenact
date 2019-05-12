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

# Execute diversity management services

- Go to the [service] foler
- Copy the hub connection string into the ```azureiot.credential``` file
- ```npm install```
- ```tsc```
- ```node create_product.ts```