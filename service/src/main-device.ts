import program from "commander";
import {listEdgeIds, tagTwin, listTagValue, tagTwinRandom} from './device'

const const_environment = 'environment'
const const_capability = 'capability'

program
    .version('0.1.0')
    .command('list').alias('ls')
    .option('-d, --details', 'show details')
    .option('-t, --tag <tagName>', 'show devices and their value of this tag')
    .action((cmd)=>{
        //console.log(cmd);
        if('details' in cmd){
            console.log('show details');
        }
        else if('tag' in cmd){
            let tagName = cmd.tag;
            listTagValue(tagName).then((result)=>{
                console.log(result)
            })
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
    .option('-r, --random', 'tag randomly N devices')
    .action((id, otherIds, cmd)=>{
        var tagKey = '';
        otherIds.push(id);
        if('random' in cmd){
            let numberToTag = parseInt(id, 10);
            if('environment' in cmd)
                tagTwinRandom('environment', cmd['environment'], numberToTag).then((tagged)=>{
                    console.log(`These devices are set to ${cmd['environment']} environment: ${tagged}`);
                });
            if('capability' in cmd)
                tagTwinRandom('capability', cmd['capability'], numberToTag).then((tagged)=>{
                    console.log(`These devices are set to ${cmd['capability']} capability: ${tagged}`);
                })
            return; //No way to go into others if it is to randomly tag devices.
        }
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