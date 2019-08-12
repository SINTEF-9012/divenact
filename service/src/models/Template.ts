import {Document, Schema, model} from 'mongoose';

export interface ITemplate extends Document{
    id: string;
    content: object
}

export const TemplateSchema = new Schema({
    id: String,
    content: {}
})

export const Template = model<ITemplate>('Template', TemplateSchema);