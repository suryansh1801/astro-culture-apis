import { Router } from 'express';
import { createOffers } from '../controllers/create-offer';
import logger from '../utils/logger';
import { getHighestDiscount } from '../controllers/get-discount';

const router = Router();

// Route for creating offers
router.post('/offer', (req, res) => {
    logger.info('POST /api/offer route hit');
    createOffers(req, res);
});

// Route for getting the highest discount
router.get('/highest-discount', (req, res) => {
    logger.info('GET /api/highest-discount route hit');
    getHighestDiscount(req, res);
});

export default router;
