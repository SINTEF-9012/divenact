import Router from "express";
import {initDatabase, resetDatabase} from '../util';

export let router = Router();

router.get('/initdb', (req, res)=>{
    initDatabase();
    res.json({message: 'Initialized database'})
})

router.get('/resetdb', (req, res)=>{
    resetDatabase();
    res.json({message: 'Reset database'})
})