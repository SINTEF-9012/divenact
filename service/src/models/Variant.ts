import {Document, Schema, model} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IVariant extends Document{
    id: string;
    template: string;
    parameter: object;
    property: object;
}

export const VariantSchema = new Schema({
    id: {type: String, required: true, unique: true},
    template: String,
    parameter: {},
    property: {}
})

VariantSchema.plugin(uniqueValidator);

export const Variant = model<IVariant>('Variant', VariantSchema);