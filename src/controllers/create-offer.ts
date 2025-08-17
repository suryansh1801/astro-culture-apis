import { Request, Response } from 'express';
import { Offer } from '../models/offer';
import logger from '../utils/logger';
import { IOffer } from '../interfaces/offer.interface';

/**
 * Controller for POST /offer
 * Receives an array of offers and saves new ones to the database.
 */
export const createOffers = async (req: Request, res: Response) => {
    // The payload is expected to be an array of offer objects
    const offers: IOffer[] = req.body;
    logger.info(
        `Received request to create offers. Payload count: ${
            Array.isArray(offers) ? offers.length : 0
        }`,
    );

    if (!Array.isArray(offers) || offers.length === 0) {
        return res.status(400).json({
            message: 'Request body must be a non-empty array of offers.',
        });
    }

    // Runtime validation for each offer (moved to utility)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { validateOffers } = require('../utils/validate-offers');
    const validationError = validateOffers(offers);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const identified_offers = offers.length;
    let new_offers_created = 0;

    try {
        // Mongoose's insertMany with `ordered: false` will attempt to insert all documents
        // and report errors for duplicates without stopping the whole operation.
        const result = await Offer.insertMany(offers, { ordered: false });
        new_offers_created = result.length;
        logger.info(
            `Successfully created ${new_offers_created} new offers out of ${identified_offers} received.`,
        );
    } catch (error: any) {
        // The error object for `insertMany` contains details about which inserts succeeded.
        logger.info(`original offers: ${JSON.stringify(offers)}`);
        logger.error('InsertMany error object: ' + error);
        if (
            error.insertedDocs &&
            Array.isArray(error.insertedDocs) &&
            error.insertedDocs.length > 0
        ) {
            new_offers_created = error.insertedDocs.length;
            logger.warn(
                `Partial success: Created ${new_offers_created} new offers out of ${identified_offers}. Error: ${error.message}`,
            );
        } else {
            logger.error(`Failed to create offers: ${error.message}`);
        }
    }

    res.status(201).json({
        noOfOffersIdentified: identified_offers,
        noOfNewOffersCreated: new_offers_created,
    });
};
