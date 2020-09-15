import program from "commander";
import {createEdgeDeploymentByEnvironment, listDeployments, triggerDeployment, createEdgeDeploymentByDevice, clearDeployments, removeDeployment, queryModules, queryDevices} from './deployment'
import {readFileSync} from "fs"
import {join} from "path"
import { registry } from "./registry";

program
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

program
    .command('get <id>')
    .action(async (id, cmd) => {
        let dep = await registry.getConfiguration(id)
        console.log(dep.responseBody)
    })

program
    .command('add <variation>')
    .option('-e, --environment <value>', 'set the environment tag')
    .option('-d, --device <id>', 'add specific deployment for device <id>')
    .action((variation, cmd)=>{
        if('environment' in cmd){
            createEdgeDeploymentByEnvironment(variation, cmd.environment)
        }
        if('device' in cmd){
            createEdgeDeploymentByDevice(variation, cmd.device)
            .then((deploymentId)=>{
                console.log(`${deploymentId} created for ${cmd.device}`)
            })
            .catch((err)=>{
                console.log("Create device-specific deployment wrong: " + err);
            })
            
        }
    })

program
    .command('create <id>')
    .option('-f --file <value>', 'local file path')
    .action(async (id, cmd)=>{
        try{
            let localfile = ''
            if('file' in cmd){
                localfile = cmd.file
            }
            else{
                console.log('no input specified')
                return
            }
            let baseDeployment = JSON.parse(readFileSync('./base_deployment.json', 'utf-8'));
            let content = readFileSync(join(__dirname, localfile), "utf-8")
            console.log(content.substring(0, 100))
            let jsonContent = JSON.parse(content)
            baseDeployment.id = id
            baseDeployment.content.modulesContent.$edgeAgent['properties.desired'].modules 
                = jsonContent.modulesContent.$edgeAgent['properties.desired'].modules;
            try{
                await registry.removeConfiguration(id)
                console.log("Existing deployment " + id + " removed")
            }
            catch(err){
                console.log(id + " not found. No need to remove");
            }
            let res = await registry.addConfiguration(baseDeployment)  
            console.log(res.responseBody)
        }catch(error){
            console.log(error)
        }
    })

program
    .command('trigger <id>')
    .action((id)=>{
        triggerDeployment(id).then((id)=>{
            console.log(`${id} is updated and is waiting for redeployment on relevant devices`)
        })
    })

program
    .command('remove <id>')
    .action((id)=>{
        if(id == 'all'){
            clearDeployments().then((result)=>{
                console.log(`Removed deployments: ${result}`);
            })
        }
        else{
            removeDeployment(id).then((result)=>{
                console.log(`Remove deployment: ${result}`);
            })
        }
        
    })

program
    .command('query-modules <id>')    
    .action((id)=>{        
        queryModules(id).then((result)=>{ 
            console.log("Modules deployed on " + id + ":");
            Object.entries(result).forEach(
                ([key, value]) => console.log(key + ": " + value)
            );                        
        })    
    })

program
    .command('query-devices')    
    .action((cmd)=>{
        queryDevices().then((result)=>{            
            console.log("Devices deployed in the hub:");
            //console.log(Object.keys(result));
            Object.entries(result).forEach(
                ([key, value]) => console.log(key + ": last updated on " + value)
            );          
        })        
    })


program.parse(process.argv);