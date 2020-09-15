import {Registry} from 'azure-iothub'
import * as yaml from 'node-yaml';
import { connection } from 'mongoose';


const credential = yaml.readSync('../../azureiot.credential');
export const connectionString = credential.iothub.connection;
let reg = null;
if(connectionString != ''){
    reg = Registry.fromConnectionString(connectionString);
}

export const registry = reg;

