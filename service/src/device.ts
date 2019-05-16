import {Device, Twin} from 'azure-iothub';
import {registry} from './registry';
import {shuffle} from 'underscore';

import { results } from 'azure-iot-common';

export async function listDevices(): Promise<Device[]> {
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

export async function getTwin(deviceId: string): Promise<Twin> {
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

export async function getTag(deviceId: string, tagName: string): Promise<String>{
    var twin = (await registry.getTwin(deviceId)).responseBody as Twin;
    return twin.tags[tagName];
}


export async function listTagValue(tagName: string): Promise<object>{
    let deviceIds = await listEdgeIds();
    let twinPromises = [] ;
    for(let id of deviceIds){
        twinPromises.push(getTwin(id));
    }
    let twins = await Promise.all(twinPromises);
    let result = {};
    for(let twin of twins){
        let twinT = twin as Twin;
        result[twinT.deviceId] = twinT.tags[tagName];
    }
    return new Promise<object>((resolve)=>{
        resolve(result);
    })
}

export async function tagTwinAll(tagName: string, tagValue: string): Promise<string[]>{
    let deviceIds = await listEdgeIds();
    for( let id of deviceIds ){
        tagTwin(id, tagName, tagValue);
    }
    return new Promise<string[]>((resolve)=>{
        // Didn't wait for the tagging to be successful... Need to be careful
        resolve(deviceIds);
    })
}

export async function tagTwinRandom(tagName: string, tagValue: string, numberToTag: number): Promise<string[]>{
    let tagedDevices = await listTagValue(tagName);
    let untagedIds: string[] = [];
    for(let id in tagedDevices){
        if(tagedDevices[id] != tagValue){
            untagedIds.push(id);
        }
    }
    
    let shuffled = <string[]> shuffle(untagedIds)
    let sliced = shuffled.slice(0, numberToTag);
    let tagged = [];
    for(let id of sliced){
        tagged.push(tagTwin(id, tagName, tagValue));
    }

    return Promise.all(tagged);
}

export async function tagTwin(deviceId: string, tagName: string, tagValue: string): Promise<string>{
    let twin = await getTwin(deviceId);
    let newTag = {};
    newTag[tagName] = tagValue
    let twinPatch = {
        tags: newTag
    }
    return new Promise<string>((resolve, reject)=>{
        twin.update(twinPatch, (err, result)=>{
            if(err) 
                reject();
            else
                resolve(result.deviceId);
        });
    });
}

export async function listEdgeIds(): Promise<string[]>{
    let result:string[] = []
    let devices = await listDevices();
    //console.log(devices)
    for (let device of devices){
        
        result.push(device.deviceId);
        
    }
    return result;
}
