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
- ```curl -L https://raw.githubusercontent.com/SINTEF-9012/divenact/master/edge/bootstrap/setup.sh -o setup.sh```
- ```echo '<Your device connection string>'>connection.credential```
- ```sudo bash ./setup.sh```

# Execute diversity management services

- Go to the [service] folder
- Copy the hub connection string into the ```azureiot.credential``` file
- ```npm install```
- ```tsc```
- ```node create_product.ts```

## Commandline interface

```node ./build/main.js <command> [--version] [--help]```

```
Top level Commands:
  device         Handle edge devices
  deployment     Handle deployments
  global         Handle devices and deployments together
  help [cmd]     display help for [cmd]
```

```node .\build\main.js global <command>```

```
Commands:
  production <variation>: set variant for production, and tag all devices into 'production'
  preview [options] <variation>: set variant for preview, and tag all or random devices into 'preview'
    Options:
        -r, --random <N>  Preview on N random devices
```

```node ./build/main.js device <command>```

```
Commands:
  list|ls [options] : List all edge devices
    Options:
        -d, --details        show details
        -t, --tag <tagName>  show devices and their values of this tag
        -h, --help           output usage information
  tag [options] <id> [otherIds...]: Add/update tags to devices (appointed by id's, or randomly with a number)
    Options:
        -e, --environment <value>  set environment tag
        -c, --capability <value>   set capability tag
        -r, --random               tag randomly N devices
        -h, --help                 output usage information
```

```node ./build/main.js deployment <command>```

```
Commands:
  list|ls [options]
    Options:
        -c, --conditions  show target conditions
        -h, --help        output usage information
  add [options] <variation>: add the deployment variation into IoT Hub
    Options:
        -e, --environment <value>  set the environment tag
        -h, --help                 output usage information
```

# Auto-provisioning via Azure Device Provisioning Service (using symmetric keys)

- Create an instance of Device Provisioning Service (DPS) and link it your existing Iot Hub as described [here](https://docs.microsoft.com/en-us/azure/iot-dps/quick-setup-auto-provision)
- Create and save an individual enrollment with the following parameters:
  - Mechanism: Symmetric Key
  - Auto-generate keys: Yes
  - Registration ID: *{registration_id}*
  - IoT Hub Device ID (optional): *{device_id}* 
  - Select how you want to assign devices to hubs: Static configuration
  - Select the IoT hubs this device can be assigned to: *{your_existing_iot_hub}*
  - In the Initial Device Twin State it is possible to include target conditions using tags, so that the provisioned device gets immediately affected by a deployment. For example:
    ```
    {
      "tags": {
       "environment": "test"
      },
      "properties": {
       "desired": {}
      }
    }
    ```
- Keep note of device registration ID ```registration_id```, primary key ```symmetric_key```, and DPS ID Scope```scope_id```, which will be used below.

- SSH into the edge device and open ```config.yaml```:
```sudo nano /etc/iotedge/config.yaml```
- Modify and save ```config.yaml``` as follows using previously noted values (pay attention to spaces in yaml!):
```
# provisioning:
#  source: "manual"
#  device_connection_string: "{connection_string}"

# DPS symmetric key provisioning configuration
provisioning:
 source: "dps"
 global_endpoint: "https://global.azure-devices-provisioning.net"
 scope_id: "{scope_id}"
 attestation:
  method: "symmetric_key"
  registration_id: "{registration_id}"
  symmetric_key: "{symmetric_key}"
```
- Restart the IoT Edge service:
```systemctl restart iotedge```
- After some time your device will be registered in your IoT Hub (using either ```registration_id``` or ```device_id```). 
- If specified tags match one of the deployments target conditions, the device will also be assigned with that deployment.

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