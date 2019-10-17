import Router from "express";
import { listDevices, listIdTags } from "../device"
import { getDeployment } from "../deployment";

export let router = Router();

router.get('/', async (req, res) => {
    res.json(await listIdTags());
});


