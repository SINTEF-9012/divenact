import {listEdgeIds} from './device'

(async()=>{
    let devices = await listEdgeIds();
    console.log(devices);
})()