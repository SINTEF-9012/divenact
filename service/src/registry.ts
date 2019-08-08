import {Registry} from 'azure-iothub'
import * as yaml from 'node-yaml';

const credential = yaml.readSync('../../azureiot.credential');
export const connectionString = credential.iothub.connection;
export const registry = Registry.fromConnectionString(connectionString);