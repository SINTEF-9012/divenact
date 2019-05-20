import { listDevices, tagTwinShuffled, listEdgeIds, tagTwinAll, tagTwinRandom } from "./device";
import { createEdgeDeploymentByEnvironment } from "./deployment";

export async function shuffleProduction(variants: string[]){
    let toTag = (value: string)=> `shuffle_${value}`;
    let devices = await listEdgeIds();
    let taggedDevices = await tagTwinShuffled('environment', variants.map(toTag), devices);

    let deployed: Promise<string>[] = [];
    for(let variant of variants){
        deployed.push(createEdgeDeploymentByEnvironment(variant, toTag(variant)))
    }
    let deployedfinal = await Promise.all(deployed);
    return Promise.resolve({deployments: deployedfinal, devices: taggedDevices});
}

export async function production(variant: string){
    await tagTwinAll('environment', 'production')
    createEdgeDeploymentByEnvironment(variant, 'production')
}

export async function preview(variant: string, numberToPreview: number){
    let result = null;
    if(numberToPreview){
        result = await tagTwinRandom('environment', 'preview', numberToPreview);
    }
    else{
        result = await tagTwinAll('environment', 'preview');
    }
    console.log(`Preview on ${result}`);
    return createEdgeDeploymentByEnvironment(variant, 'preview');
}