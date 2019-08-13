import Router from "express";
import {Variant} from "../models/Variant"

export let router = Router();

router.get('/', (req, res, next) =>{
    Variant.find({}, (err, variants)=>{
        if(err) next(err);
        else res.json(variants);
    })
})