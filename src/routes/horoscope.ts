import { Router } from "express";
import logger from "../utils/logger";
import {
  getTodaysHoroscope,
  getHoroscopeHistory,
} from "../controllers/horoscopeController";
import { protect } from "../middleware/authMiddleware";
import apiLimiter from "../middleware/rateLimiter";

const router = Router();

router.use(apiLimiter);
router.use(protect);

/**
 * @swagger
 * /api/horoscope/today:
 *  get:
 *      summary: Get today's horoscope for the authenticated user
 *      tags: [Horoscope]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *  200:
 *      description: Today's horoscope
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      date:
 *                          type: string
 *              format: date
 *              example: "2025-08-17"
 *          zodiacSign:
 *              type: string
 *              example: "Leo"
 *          horoscope:
 *              type: string
 *              example: "Your creativity is off the charts! It's a perfect day to start a new artistic project, Leo."
 * 401:
 *      description: Unauthorized (invalid or missing token)
 * 429:
 *      description: Too many requests
 */
router.get("/today", (req, res, next) => {
  logger.info("/today horoscope route hit", { userId: req.user?._id });
  return getTodaysHoroscope(req, res, next);
});

/**
 * @swagger
 * /api/horoscope/history:
 *  get:
 *      summary: Get the last 7 days of horoscopes for the authenticated user
 *      tags: [Horoscope]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *  200:
 *      description: A list of the last 7 horoscopes
 *      content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          date:
 *                              type: string
 *                              format: date
 *                              example: "2025-08-17"
 *                          zodiacSign:
 *                              type: string
 *                              example: "Leo"
 *          horoscope:
 *              type: string
 *              example: "Your creativity is off the charts! It's a perfect day to start a new artistic project, Leo."
 *  401:
 *      description: Unauthorized
 */
router.get("/history", (req, res, next) => {
  logger.info("/history horoscope route hit", { userId: req.user?._id });
  return getHoroscopeHistory(req, res, next);
});

export default router;
