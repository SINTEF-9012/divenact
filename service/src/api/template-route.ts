import Router from "express";
import {Template} from "../models/Template"

export let router = Router();

router.get('/', (req, res, next) =>{
    Template.find({}, (err, templates)=>{
        if(err) next(err);
        else res.json(templates);
    })
})

router.put('/:template', async (req, res, next) => {
    let value = req.body;
    let query = value._id ? {_id: value._id} : {id: value.id}
    let options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false};
    console.log({value: value, query: query});
    let result = await Template.findOneAndUpdate(query, value, options);
    res.json(result);
})

router.delete('/:template', async(req, res, next)=>{
    Template.deleteOne({id: req.params['template']}, err=>{
        if(err) next(err);
        else res.send({message: 'Deleted'});
    })
})