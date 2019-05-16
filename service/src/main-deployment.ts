import * as program from "commander";
import {createEdgeDeploymentByEnvironment, listDeployments} from './deployment'

program
    .version('0.1.0')
    .command('list').alias('ls')
    .option('-c, --conditions', 'show target conditions')
    .action((cmd)=>{
        listDeployments().then((result)=>{
            if('conditions' in cmd){
                console.log(result);
            }
            else{
                console.log(Object.keys(result));
            }
        })
        
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