import { Schema, model } from 'mongoose';
import { IOffer } from '../interfaces/offer.interface';

// Mongoose Schema Definition
const OfferSchema = new Schema<IOffer>({
    adjustment_type: { type: String, required: true },
    adjustment_id: { type: String, required: true, unique: true }, // Ensures no duplicates
    summary: { type: String, required: true },
    contributors: {
        payment_instrument: { type: [String], index: true }, // Index for faster queries
        banks: { type: [String], index: true }, // Index for faster queries
        emi_months: { type: [String] },
        card_networks: { type: [String] },
    },
    display_tags: { type: [String] },
});

// Create and export the Mongoose model
export const Offer = model<IOffer>('Offer', OfferSchema);
