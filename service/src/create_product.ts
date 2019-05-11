import { Registry, Device, Twin } from 'azure-iothub';

import * as fs from 'fs';

//var iothub = require('azure-iothub');
import * as yaml from 'node-yaml';

var credential = yaml.readSync('../../azureiot.credential');
var connectionString = credential.iothub.connection;
let registry = Registry.fromConnectionString(connectionString);

var pool = yaml.readSync('../pool.yaml')
console.log(pool);

var resolve = function(input_pool){
    var result = {}
    var variants = input_pool.variants;
    for (var varname in variants){
        var variant = variants[varname];
        var valuestr = JSON.stringify(input_pool.templates[variant.template])
        for (var param in variant.parameter){
            valuestr = valuestr.replace('{{'+param+'}}', variant.parameter[param])
        }
        JSON.parse(valuestr)
        result[varname] = JSON.parse(valuestr)
    }
    return result;
}

var candidates = resolve(pool);

async function createEdgeDeployment (deploymentId: string, modules: object, condition: string): Promise<string> {
    return new Promise<string>((resolve, reject) => { 
        console.log('Set deploymment ' + deploymentId + ' to product' );
        let baseDeployment = JSON.parse(fs.readFileSync('./base_deployment.json', 'utf8'));
        baseDeployment.id = deploymentId;
        baseDeployment.content.modulesContent.$edgeAgent['properties.desired'].modules=modules;
        baseDeployment.targetCondition = condition; //"tags.environment='product'";
        console.log(JSON.stringify( baseDeployment, null, 2));
        registry.removeConfiguration(deploymentId, function(err) {
            if(err){
                console.log(deploymentId + " not found. No need to remove");
            }
            registry.addConfiguration(baseDeployment, function(err) {
                if (err) {
                    console.log('add configuration failed: ' + err);
                    reject(err);
                } else {
                    console.log('add configuration succeeded');
                    resolve(deploymentId);
                }
            });
        }); 
    });
}

async function setProduction (varname: string){
    await createEdgeDeployment(
        'production',
        candidates[varname],
        "tags.environment='product'"
    )
}

async function listDevices(): Promise<Device[]> {
    return new Promise<Device[]>((resolve, reject) => {
      registry.list((error: Error, deviceList: Device[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(deviceList);
        }
      });
    });
};

async function getTwin(deviceId: string): Promise<Twin> {
    return new Promise<Twin>((resolve, reject) => {
      registry.getTwin(deviceId, (error: Error, twin: Twin) => {
        if (error) {
          reject(error);
        } else {
          resolve(twin);
        }
      });
    });
};

async function tagTwin(deviceId: string, newtag: string): Promise<Twin>{
    let twin = await getTwin(deviceId);
    let twinPatch = {
        tags:{
            environment: newtag
        }
    }
    return new Promise<Twin>((resolve, reject)=>{
        twin.update(twinPatch, (err, result)=>{
            if(err) 
                reject();
            else
                resolve(result);
        });
    });
}


(async()=>{
    let newproduct = await setProduction('led-red');
    //let devices = await listDevices();
    //let twin = await tagTwin('PiEdge1', 'preview');
    //console.log(twin);
})()

