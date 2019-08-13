import {Document, Schema, model} from 'mongoose';
import { IPredefinedTag, PredefinedTagSeed } from './PedefinedTag';

export interface ITemplate extends Document{
    id: string;
    content: object;
    property: {
        predefinedtag: { [id: string] : string; }
    }
}

export const TemplateSchema = new Schema({
    id: String,
    content: Object,
    property: {
        predefinedtag: {
            type: Map,
            of: String
        }
    }
})

export const Template = model<ITemplate>('Template', TemplateSchema);