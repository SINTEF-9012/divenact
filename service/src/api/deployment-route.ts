import Router from "express";
import { listDevices, listIdTags } from "../device"
import { getDeployment, listDeployments, clearDeployments, queryAppliedDevices } from "../deployment";

export let router = Router();

router.get('/', async (req, res)=>{
    let deployments = await listDeployments();
    let result = [];
    for(let id of Object.keys(deployments)){
        result.push({
            id: id,
            condition: deployments[id]
        })
    }
    res.json(result);
});

router.get('/:deployment/applied', async (req, res) => {    
    res.json(await queryAppliedDevices(req.params['deployment']));
});

router.get('/:deployment/targeted', async (req, res) => {    
    res.json(await queryAppliedDevices(req.params['deployment']));
});

router.delete('/', async (req, res)=>{
    res.json(await clearDeployments());
})


