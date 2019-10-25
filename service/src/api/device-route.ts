import Router from "express";
import { listDevices, listIdTags, tagTwin } from "../device"
// import { getDeployment } from "../deployment";

export let router = Router();

/**
 * Get device tags.
 */
router.get('/', async (req, res) => {
    res.json(await listIdTags());
});

/**
 * Update device tags.
 */
router.put('/:device', async (req, res, next) => {    
    let deviceId = req.params['device']; 
    let body = req.body;
    //TODO: returned result is overwritten in the loop.
    let result: Promise<string>;
    Object.keys(req.body).forEach(key => {
        console.log(key + '---' + req.body[key]);
        result = tagTwin(deviceId, key, req.body[key]);
    })        
    res.json(result);
})




