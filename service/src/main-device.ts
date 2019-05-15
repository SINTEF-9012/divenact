import * as program from "commander";
import {listEdgeIds, tagTwin} from './device'

program
    .version('0.1.0')
    .command('list').alias('ls')
    .option('-d, --details', 'show details')
    .action((cmd)=>{
        if(cmd.details){
            console.log('show details');
        }
        else{
            listEdgeIds().then( (ids)=>{
                console.log(ids)
            })
        }
    })

program.version('0.1.0')
    .command('tag <id> [otherIds...]')
    .option('-e, --environment <value>', 'set environment tag')
    .option('-c, --capability <value>', 'set capability tag')
    .action((id, otherIds, cmd)=>{
        var tagKey = '';
        otherIds.push(id);
        if('environment' in cmd){
            for(let i of otherIds){
                tagTwin(i, 'environment', cmd.environment)
            }
        }
        if('capability' in cmd){
            for(let i of otherIds){
                tagTwin(i, 'capability', cmd.capability)
            }
        }
    })
program.parse(process.argv);

//program.parse(process.argv);