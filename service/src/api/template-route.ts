import Router from "express";
import {Template} from "../models/Template"

export let router = Router();

router.get('/', (req, res, next) =>{
    Template.find({}, (err, templates)=>{
        if(err) next(err);
        else res.json(templates);
    })
})