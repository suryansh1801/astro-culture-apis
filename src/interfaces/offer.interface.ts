import { Document } from 'mongoose';

// Interface for type-checking the Contributors object
interface IContributors {
    payment_instrument: string[];
    banks: string[];
    emi_months: string[];
    card_networks: string[];
}

// Interface for type-checking the Offer document
export interface IOffer extends Document {
    adjustment_type: string;
    adjustment_id: string;
    summary: string;
    contributors: IContributors;
    display_tags: string[];
}
