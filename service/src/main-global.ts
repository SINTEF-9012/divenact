import * as program from "commander";
import {listEdgeIds, tagTwinAll} from './device'
import {createEdgeDeploymentByEnvironment} from './deployment'

program
    .version('0.1.0')
    .command('production <variation>')
    .action((variation, cmd)=>{
        createEdgeDeploymentByEnvironment(variation, 'production')
        tagTwinAll('environment', 'production')
    })

program.version('0.1.0')
    .command('add <variation>')
    .action((variation)=>{
        console.log('show ')
    })
program.parse(process.argv);

//program.parse(process.argv);