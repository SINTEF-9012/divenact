import Router from "express";
import { production, preview, safemode, testing, shuffleProduction, preview_old } from "../global"
import { getDeployment, createEdgeDeploymentByEnvironment } from "../deployment";

export let router = Router();

router.get('/test', (req, res) => {
    res.json({message: 'here'})
})

router.put('/production/:variant', async (req, res) => {
    let pid = await production(req.params['variant']);
    res.json((await getDeployment(pid)).responseBody);
})

router.put('/previewold/:variant', async (req, res)=>{
    let numberToPreview = req.body.random || 1;
    console.log(numberToPreview);
    let pid = await preview_old(req.params['variant'], numberToPreview);
    res.json((await getDeployment(pid)).responseBody);
})

router.put('/preview/:variant', async (req, res) => {    
    let pid = await preview(req.params['variant']);
    res.json((await getDeployment(pid)).responseBody);
})

router.put('/safemode/:variant', async (req, res) => {
    let pid = await safemode(req.params['variant']);
    res.json((await getDeployment(pid)).responseBody);
})

router.put('/testing/:variant', async (req, res) => {
    //let numberToPreview = req.body.random || 1;
    //console.log(numberToPreview);
    let pid = await testing(req.params['variant']);
    res.json((await getDeployment(pid)).responseBody);
})

router.put('/shuffle', async (req, res) => {
    let result = await shuffleProduction(req.body.variants);
    res.json(result);
})

router.put('/deploy/:variant/:environment', async (req, res) => {
    console.log('Pushing ' + req.params['variant'] + ' into ' + req.params['environment']);
    let result = createEdgeDeploymentByEnvironment(req.params['variant'], req.params['environment']);
    res.json(result);
})

