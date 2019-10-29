import { listDevices, tagTwinShuffled, listEdgeIds, tagTwinAll, tagTwinRandom, listTagValue } from "./device";
import { createEdgeDeploymentByEnvironment, getCapabilityFromVariant } from "./deployment";
import {registry} from "./registry"

export async function shuffleProduction(variants: string[]){
    let group = {}
    for(let variant of variants){
        let capability = await getCapabilityFromVariant(variant);
        if(!capability)
            capability = 'ANY';
        if(! (capability in group)){
            group[capability] = <string[]>[];
        }
        group[capability].push(variant)
    }

    //let devices = {PiEdge1: 'ky016', PiEdge2: 'ky016', PiEdge3: 'ky016', PiEdge4: 'ky016', PiEdge5: 'sensehat'} //
    let devices = await listTagValue('capability');
    console.log(devices)
    let isDeviceWithCapability = (device:string, capability:string) => devices[device] == capability || (capability=='ANY' && !devices[device])
    //console.log(group);
    let toTag = (value: string)=> `shuffle_${value}`;
    let taggedDevices = []
    for(let capability in group){
        console.log(capability)
        let subvariants = group[capability];
        let subdevices = Object.keys(devices).filter((device) => isDeviceWithCapability(device, capability));
        console.log(`====> ${subvariants}, subdevices: ${subdevices}`)
        taggedDevices.push(tagTwinShuffled('environment', subvariants.map(toTag), subdevices));
    }

    let finaldevices = await Promise.all(taggedDevices);

    let deployed: Promise<string>[] = [];
    for(let variant of variants){
        deployed.push(createEdgeDeploymentByEnvironment(variant, toTag(variant)))
    }
    let deployedfinal = await Promise.all(deployed);
    return Promise.resolve({deployments: deployedfinal, devices: finaldevices});
}

export async function production(variant: string){
    await tagTwinAll('environment', 'production')
    return createEdgeDeploymentByEnvironment(variant, 'production')
}

export async function preview_old(variant: string, numberToPreview: number){
    let result = null;
    if(numberToPreview){
        let capability = await getCapabilityFromVariant(variant);
        result = await tagTwinRandom('environment', 'preview', numberToPreview, capability);
    }
    else{
        result = await tagTwinAll('environment', 'preview');
    }
    console.log(`Preview on ${result}`);
    return createEdgeDeploymentByEnvironment(variant, 'preview');
}

export async function preview(variant: string){
    await tagTwinAll('environment', 'preview')
    return createEdgeDeploymentByEnvironment(variant, 'preview')
}

export async function safemode(variant: string){
    await tagTwinAll('environment', 'safe-mode')
    return createEdgeDeploymentByEnvironment(variant, 'safe-mode')
}

export async function testing(variant: string){
    //await tagTwinAll('environment', 'testing')
    return createEdgeDeploymentByEnvironment(variant, 'testing')
}

export async function query(queryString: string): Promise<object>{

    let query = registry.createQuery(queryString, 100);

    try{
        
        let result = await query.next();
        console.log(result.result);
        
    }
    catch(e){
        console.log("that's all")
    }

    return Promise.resolve({});

} 
