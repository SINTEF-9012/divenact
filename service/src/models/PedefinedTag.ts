import {Document, Schema, model} from 'mongoose';

export interface IPredefinedTag extends Document{
    tagName: string;
    value: string;
}

export const PredefinedTagSeed = {
    tagName: String,
    value: String
}

export const PredefinedTagSchema = new Schema(PredefinedTagSeed);

export const PredefinedTag = model<IPredefinedTag>('PredefinedTag', PredefinedTagSchema);