import Router from "express";
import { listDevices, listIdTags } from "../device"
import { getDeployment, listDeployments } from "../deployment";

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


