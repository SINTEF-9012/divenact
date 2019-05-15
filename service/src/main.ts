import {Device, Twin} from 'azure-iothub';
import {listDevices} from './device';
import {setProduction} from './deployment';

import * as program from "commander";


program.version('0.1.0')
    .command('device', 'Handle edge devices')//.action(()=>{console.log('d')})
    .command('deployment', 'Handle deployments')
    .command('global', 'Handle devices and deployments together')
    .parse(process.argv)


// (async()=>{
//     let newproduct = await setProduction('led-red');
// })()