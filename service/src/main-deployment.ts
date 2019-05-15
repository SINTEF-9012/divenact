import * as program from "commander";
import {createEdgeDeploymentByEnvironment} from './deployment'

program
    .version('0.1.0')
    .command('list').alias('ls')
    .option('-d, --details', 'show details')
    .action((cmd)=>{
        if(cmd.details){
            console.log('show details');
        }
        else{
            console.log('list all deployments');
        }
    })

program.version('0.1.0')
    .command('add <variation>')
    .option('-e, --environment <value>', 'set the environment tag')
    .action((variation, cmd)=>{
        if('environment' in cmd){
            createEdgeDeploymentByEnvironment(variation, cmd.environment)
        }
    })
program.parse(process.argv);

//program.parse(process.argv);