import { Registry, Device, Twin } from 'azure-iothub';
import {Variant} from './models/Variant';
import {Template} from './models/Template';

import * as fs from 'fs';

//var iothub = require('azure-iothub');
import * as yaml from 'node-yaml';
//import { results } from 'azure-iot-common';
import {registry} from './registry'

async function resolve(varname: string){
    let variant = await Variant.findOne({id: varname});
    let template = await Template.findOne({id: variant.template});
    let valuestr = JSON.stringify(template.content);
    for (let [key, value] of Object.entries(variant.parameter)){
        valuestr = valuestr.replace('{{'+key+'}}', value)
    }
    let result = {
        ...variant, 
        content: JSON.parse(valuestr),
        property: {...template.property, ...variant.property}
    }
    return result;
}

async function getCandidate(varname: string){
    return resolve(varname);
}
//var candidates = resolvePool(pool);

export async function removeDeployment(deploymentId: string){
    return new Promise<string>((resolve) => { 
        registry.removeConfiguration(deploymentId, function(err) {
            if(err){
                //TODO: Assuming the only reason for failure is "no deployment found"
                console.log(deploymentId + " not found. No need to remove");
                resolve(deploymentId); 
            }
            else{
                resolve(deploymentId);
            }
        });
    });
}

function joinConditions(condition1: string, condition2: string, operation:string = 'and'): string{
    if(condition1 && condition2){
        return `${condition1} ${operation} ${condition2}`
    }
    else if(condition1){
        return condition1
    }
    else{
        return condition2
    }
}

async function getPredefinedConditions(varname: string): Promise<string>{
    let variant = await getCandidate(varname);
    let tags = variant.property.predefinedtag;
    console.log(tags)
    if(tags.has('capability')){
        return `tags.capability='${tags.get('capability')}'`
    }
    else
        return undefined 
}

async function createEdgeDeployment (deploymentId: string, varname: string, condition: string, priority:number = 1): Promise<string> {
    
        let baseDeployment = JSON.parse(fs.readFileSync('./base_deployment.json', 'utf8'));
        baseDeployment.id = deploymentId;
        baseDeployment.content.modulesContent.$edgeAgent['properties.desired'].modules = (await getCandidate(varname)).content;
        baseDeployment.targetCondition = joinConditions(condition, await getPredefinedConditions(varname)); 
        console.log(baseDeployment.targetCondition)
        baseDeployment.priority = priority;
        
        await removeDeployment(deploymentId);
        await registry.addConfiguration(baseDeployment);
        return deploymentId;
}

export async function createEdgeDeploymentByEnvironment(varname: string, environment: string){
    return createEdgeDeployment(
        `env_${environment}_${varname}`,
        varname,
        `tags.environment='${environment}'`
    );
}

export async function getCapabilityFromVariant(varname: string): Promise<string>{
    let variant = await getCandidate(varname);
    //console.log(variant);
    let tags =  variant.property.predefinedtag;
    console.log(tags)
    console.log(tags.get('capability'))
    if(!tags) 
        return null;
    else
        return tags.get('capability')
}

async function removeEdgeDeploymentForDevice(deviceId: string): Promise<String>{
    let deployments = await listDeployments();
    let removed = [];
    for(let deployment of Object.keys(deployments)){
        if(deployment.startsWith(`device_${deviceId}_`)){
            removed.push(removeDeployment(deployment))
        }
    }
    let finallyRemoved = await Promise.all(removed);
    return Promise.resolve(finallyRemoved.pop());
}

export async function createEdgeDeploymentByDevice(varname: string, deviceId: string){
    let removed = await removeEdgeDeploymentForDevice(deviceId);
    if(removed){
        console.log(`Deployment ${removed} removed first`)
    }
    return createEdgeDeployment(
        `device_${deviceId}_${varname}`.toLowerCase(),
        varname,
        `deviceId='${deviceId}'`,
        10
    );
}

export async function listDeployments(): Promise<object>{
    let deployments = (await registry.getConfigurations()).responseBody;
    let result = {};
    for(let dpl of deployments){
        result[dpl.id] = dpl;
    }
    return Promise.resolve(result);
}

export async function triggerDeployment(deploymentId: string): Promise<string>{
    let deployment = (await registry.getConfiguration(deploymentId)).responseBody;
    deployment.priority += 1;
    
    return Promise.resolve(<string>(await registry.updateConfiguration(deployment)).responseBody.id);
}

export async function clearDeployments(): Promise<string[]>{
    let deployments = await listDeployments();
    let result: Promise<string>[] = [];
    for(let id of Object.keys(deployments)){
        result.push(removeDeployment(id))
    }
    return Promise.all(result);
}

export async function getDeployment(id: string) {
    return registry.getConfiguration(id);
}

/**
 * Get all the deployments from the IoT hub.
 */
export async function getDeployments(): Promise<object> {
    return Promise.resolve(registry.getConfigurations());
}

/**
 * Query modules on a device.
 * 
 * @param deviceId device ID
 */
export async function queryModules(deviceId: string): Promise<object>{
    let modules = (await registry.getModulesOnDevice(deviceId)).responseBody;
    //let result = {};
    let result : object[] = [];
    for(let module of modules) {
        result.push(module); 
        //[module.moduleId] = module.connectionState;
    }
    return Promise.resolve(result);
}

/**
 * Query devices to which a deployment was applied
 * 
 * @param deploymentId deployment ID
 */
export async function queryAppliedDevices(deploymentId: string): Promise<Twin[]> {
    
    return new Promise<Twin[]>((resolve, reject) => {

        let query = registry.createQuery("SELECT * FROM devices.modules WHERE moduleId = '$edgeAgent' and configurations.[[" + deploymentId + "]].status = 'Applied'", 100);
        query.nextAsTwin(function(err, results: Twin[]) {        
        if (err) {
            reject(err);
        } else {                
            //console.log("Applied devices: " + results);     
            resolve(results);
            }
        });
    });   
}

/**
 * Query devices to which a deployment was targeted
 * 
 * @param deploymentId deployment ID
 */
export async function queryTargetedDevices(deploymentId: string): Promise<Twin[]> {
    
    return new Promise<Twin[]>((resolve, reject) => {

        let query = registry.createQuery("SELECT * FROM devices.modules WHERE moduleId = '$edgeAgent' and configurations.[[" + deploymentId + "]].status = 'Targeted'", 100);
        query.nextAsTwin(function(err, results: Twin[]) {        
        if (err) {
            reject(err);
        } else {              
            //console.log("Targeted devices: " + results);    
            resolve(results);
            }
        });
    });   
}

export async function queryDevices(): Promise<object>{

    return new Promise<Object>((resolve, reject) => {

        let query = registry.createQuery("SELECT * FROM devices", 100);
        query.nextAsTwin(function(err, results) {        
        if (err) {
            reject(err);
        } else {  
            let result = {}; 
            results.forEach(function(device) {                    
                //console.log("-- " + device.deviceId + " properties:" + device.properties);
                result[device.deviceId] = device.properties.desired.$metadata.$lastUpdated;
                //console.log(Object.keys(result));
            });          
            resolve(result);
            }
        });
    });
    /* console.log(Object.keys(result));

        registry.getTwin(deviceId, (error: Error, twin: Twin) => {
          if (error) {
            reject(error);
          } else {
            resolve(twin);
          }
        });
      });

    let result = {}; */

    /* let query = registry.createQuery("SELECT * FROM devices", 100);
        query.nextAsTwin(function(err, results) {        
        if (err) {
            console.error('Failed to fetch the results: ' + err.message);
        } else {            
            results.forEach(function(device) {                    
                //console.log("-- " + device.deviceId + " properties:" + device.properties);
                result[device.deviceId] = device.tags;
                //console.log(Object.keys(result));
            });
        } */
    
    //return Promise.resolve(result);
} 