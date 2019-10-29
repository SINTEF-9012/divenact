import {Document, Schema, model} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { IPredefinedTag, PredefinedTagSeed } from './PedefinedTag';

export interface ITemplate extends Document{
    id: string;
    content: object;
    property: {
        predefinedtag: any
    }
}

export const TemplateSchema = new Schema({
    id: {type: String, required: true, unique: true},
    content: Object,
    property: {
        predefinedtag: {
            type: Map,
            of: String
        }
    }
})

TemplateSchema.plugin(uniqueValidator);

export const Template = model<ITemplate>('Template', TemplateSchema);