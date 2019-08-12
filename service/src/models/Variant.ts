import {Document, Schema, model} from 'mongoose';

export interface IVariant extends Document{
    id: string;
    template: string;
    parameter: object
}

export const VariantSchema = new Schema({
    id: String,
    template: String,
    parameter: {}
})

export const Variant = model<IVariant>('Variant', VariantSchema);