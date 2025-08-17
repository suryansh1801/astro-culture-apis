import { IOffer } from '../interfaces/offer.interface';
import { Offer } from '../models/offer';
import { calculateDiscount } from '../utils/helper-service';
import logger from '../utils/logger';
import { Request, Response } from 'express';
import { validateDiscountQuery } from '../utils/validate-query';

/**
 * Controller for GET /highest-discount
 * Finds the best applicable offer and calculates the discount.
 */
export const getHighestDiscount = async (req: Request, res: Response) => {
    logger.info('Received request to get highest discount');
    // Extract query parameters
    const validationError = validateDiscountQuery(req.query);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }
    const { amountToPay, bankName, paymentInstrument } = req.query;
    const parsedAmount = parseFloat(amountToPay as string);

    try {
        // Query the database for offers matching the bank and payment instrument
        let applicableOffers: Partial<IOffer>[] = [];
        if (!paymentInstrument) {
            applicableOffers = await Offer.find({
                'contributors.banks': bankName as string,
            });
        } else {
            applicableOffers = await Offer.find({
                'contributors.banks': bankName as string,
                'contributors.payment_instrument': paymentInstrument as string,
            });
        }

        if (applicableOffers.length === 0) {
            return res.json({ highestDiscountAmount: 0 });
        }

        // Calculate the discount for each applicable offer and find the maximum
        const maxDiscount = applicableOffers.reduce(
            (max, offer: Partial<IOffer>) => {
                const currentDiscount = calculateDiscount(
                    offer.summary as string,
                    parsedAmount,
                );
                return Math.max(max, currentDiscount);
            },
            0,
        );

        logger.info(`Highest discount found: ${maxDiscount}`);
        res.json({ highestDiscountAmount: maxDiscount });
    } catch (error) {
        logger.error('Error fetching highest discount:');
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
