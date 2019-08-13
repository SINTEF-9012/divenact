
import * as yaml from 'node-yaml';
import {Template} from './models/Template';
import {PredefinedTag, IPredefinedTag} from './models/PedefinedTag';
import {Variant} from './models/Variant';

function onInsert(err, docs) {
    if (err) {
        console.log(err);
    } else {
        console.info('%d items were successfully stored.', docs.length);
    }
}

function onDelete(err, docs) {
    if (err) {
        console.log(err);
    } else {
        console.info('%d items were successfully deleted.', docs.length);
    }
}

export function resetDatabase(){
    Template.collection.deleteMany({}, onDelete);
    PredefinedTag.collection.deleteMany({}, onDelete);
    Variant.collection.deleteMany({}, onDelete);
}

export function initDatabase(){
    let pool = yaml.readSync('../pool.yaml');
    let templates = Object.entries(pool.templates).map(([key, value])=>{
        let properties = {}
        if(key in pool.predefinedtags){
            properties['predefinedtag'] = pool.predefinedtags[key]
        }
        return{
            id: key,
            content: value,
            property: properties
        }
    })

    let variants = Object.entries(pool.variants).map(([key, value])=>{
        return {
            id: key,
            template: value['template'],
            parameter: value['parameter']
        }
    })

    Template.collection.insertMany(templates, onInsert);
    Variant.collection.insertMany(variants, onInsert);
    
}