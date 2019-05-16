import * as program from "commander";
import {listEdgeIds, tagTwinAll, tagTwinRandom} from './device'
import {createEdgeDeploymentByEnvironment} from './deployment'

program
    .version('0.1.0')
    .command('production <variation>')
    .action((variation, cmd)=>{
        createEdgeDeploymentByEnvironment(variation, 'production')
        tagTwinAll('environment', 'production')
    });

program
    .version('0.1.0')
    .command('preview <variation>')
    .option('-r, --random <N>', 'Preview on N random devices', parseInt)
    .action((variation, cmd)=>{
        createEdgeDeploymentByEnvironment(variation, 'preview');
        if('random' in cmd){
            tagTwinRandom('environment', 'preview', cmd.random).then((result)=>{
                console.log(`Preview on ${result}`);
            });
        }
        else{
            tagTwinAll('environment', 'preview').then((result)=>{
                console.log(`Preview on ${result}`);
            });
        }
    })


program.version('0.1.0')
    .command('add <variation>')
    .action((variation)=>{
        console.log('show ')
    })
program.parse(process.argv);

//program.parse(process.argv);