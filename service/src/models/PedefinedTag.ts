import {Document, Schema, model} from 'mongoose';

export interface IPredefinedTag extends Document{
    template: string;
    tagName: string;
    value: string;
}

export const PredefinedTagSchema = new Schema({
    template: String,
    tagName: String,
    value: String
})

export const PredefinedTag = model<IPredefinedTag>('PredefinedTag', PredefinedTagSchema);