
import * as yaml from 'node-yaml';
import {Template} from './models/Template';
import {PredefinedTag} from './models/PedefinedTag';
import {Variant} from './models/Variant';

function onInsert(err, docs) {
    if (err) {
        console.log(err);
    } else {
        console.info('%d items were successfully stored.', docs.length);
    }
}

export function resetDatabase(){
    Template.collection.deleteMany({});
    PredefinedTag.deleteMany({});
    Variant.deleteMany({});
}

export function initDatabase(){
    let pool = yaml.readSync('../pool.yaml');
    let templates = Object.entries(pool.templates).map(([key, value])=>{
        return{
            id: key,
            content: value
        }
    })

    let pts = Object.entries(pool.predefinedtags).map(([key, value])=>{
        let [tagName, tagValue] = Object.entries(value)[0];
        return {
            template: key,
            tagName: tagName,
            value: tagValue
        }
    });

    let variants = Object.entries(pool.templates).map(([key, value])=>{
        return {
            id: key,
            template: value['template'],
            parameter: value['parameter']
        }
    })

    Template.collection.insertMany(templates, onInsert);
    PredefinedTag.collection.insertMany(pts, onInsert);
    Variant.collection.insertMany(variants, onInsert);
    
}