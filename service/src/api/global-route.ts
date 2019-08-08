import Router from "express";
import { production, preview, shuffleProduction } from "../global"
import { getDeployment } from "../deployment";

export let router = Router();

router.get('/test', (req, res)=>{
    res.json({message: 'here'})
})

router.put('/production/:variant', async (req, res)=>{
    let pid = await production(req.params['variant']);
    res.json((await getDeployment(pid)).responseBody);
})

router.put('/preview/:variant', async (req, res)=>{
    let numberToPreview = req.body.random || 1;
    console.log(numberToPreview);
    let pid = await preview(req.params['variant'], numberToPreview);
    res.json((await getDeployment(pid)).responseBody);
})

router.put('/shuffle', async (req, res)=>{
    let result = await shuffleProduction(req.body.variants);
    res.json(result);
})

