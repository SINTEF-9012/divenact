import Router from "express";
import {Variant} from "../models/Variant"

export let router = Router();

router.get('/', (req, res, next) =>{
    Variant.find({}, (err, variants)=>{
        if(err) next(err);
        else res.json(variants);
    })
})

router.delete('/:variant', (req, res, next)=>{
    Variant.deleteOne({id: req.params['variant']}, err=>{
        if(err) next(err);
        else res.send({message: 'Deleted'});
    })
})

router.put('/:variant', async (req, res, next) => {
    let value = req.body;
    let query = value._id ? {_id: value._id} : {id: value.id} //new or update?
    let options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false};
    console.log({value: value, query: query});
    let result = await Variant.findOneAndUpdate(query, value, options);
    res.json(result);
})