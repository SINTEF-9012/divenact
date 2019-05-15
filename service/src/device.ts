import {Device, Twin} from 'azure-iothub';
import {registry} from './registry';
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

export async function tagTwinAll(tagName: string, tagValue: string): Promise<string[]>{
    let deviceIds = await listEdgeIds();
    for( let id of deviceIds ){
        tagTwin(id, tagName, tagValue);
    }
    return new Promise<string[]>((resolve)=>{
        resolve(deviceIds);
    })
}

export async function tagTwin(deviceId: string, tagName: string, tagValue: string): Promise<Twin>{
    let twin = await getTwin(deviceId);
    let newTag = {};
    newTag[tagName] = tagValue
    let twinPatch = {
        tags: newTag
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

export async function listEdgeIds(): Promise<string[]>{
    let result:string[] = []
    let devices = await listDevices();
    //console.log(devices)
    for (let device of devices){
        
        result.push(device.deviceId);
        
    }
    return result;
}
