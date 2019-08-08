import program from "commander";
import {listEdgeIds, tagTwinAll, tagTwinRandom} from './device'
import {createEdgeDeploymentByEnvironment} from './deployment'
import {shuffleProduction, production, preview, query} from './global'

program
    .command('production <variation>')
    .action((variation, cmd)=>{
        production(variation);
    });

program
    .command('preview <variation>')
    .option('-r, --random <N>', 'Preview on N random devices', parseInt)
    .action((variation, cmd)=>{
        preview(variation, cmd.random);
    })

program
    .command('shuffle <variation> [variantions...]')
    .action((variation, variations)=>{
        variations.push(variation);
        shuffleProduction(variations).then((result)=>{
            console.log(result);
        })
    });

program.version('0.1.0')
    .command('add <variation>')
    .action((variation)=>{
        console.log('show ')
    })

program
    .command('query <queryString>')    
    .action((queryString)=>{
          query(queryString);
    })

program.parse(process.argv);