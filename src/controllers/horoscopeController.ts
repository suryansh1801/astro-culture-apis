import { RequestHandler } from "express";
import HoroscopeHistory from "../models/HoroscopeHistory";
import { getDailyHoroscope } from "../utils/horoscopeData";
import logger from "../utils/logger";
import { ZodiacSign } from "../utils/zodiacCalculator";

export const getTodaysHoroscope: RequestHandler = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "User not found" });

    const { _id: userId, zodiacSign } = req.user;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let history = await HoroscopeHistory.findOne({ userId, date: today });

    if (history) {
      logger.info("Horoscope history found", { userId, date: today });
      return res.json({
        date: today.toISOString().split("T")[0],
        zodiacSign: history.zodiacSign,
        horoscope: history.horoscopeText,
      });
    }

    const horoscopeText = getDailyHoroscope(zodiacSign as ZodiacSign);

    history = await HoroscopeHistory.create({
      userId,
      zodiacSign,
      date: today,
      horoscopeText,
    });

    logger.info("Horoscope history created", { userId, date: today });
    res.json({
      date: today.toISOString().split("T")[0],
      zodiacSign: history.zodiacSign,
      horoscope: history.horoscopeText,
    });
  } catch (error) {
    logger.error("Error fetching horoscope today", { error });
    res.status(500).json({ message: "Server Error" });
  }
};

export const getHoroscopeHistory: RequestHandler = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "User not found" });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const history = await HoroscopeHistory.find({
      userId: req.user._id,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: -1 });

    logger.info("Horoscope history fetched", { userId: req.user._id });
    res.json(
      history.map((h) => ({
        date: h.date.toISOString().split("T")[0],
        zodiacSign: h.zodiacSign,
        horoscope: h.horoscopeText,
      }))
    );
  } catch (error) {
    logger.error("Error fetching horoscope history", { error });
    res.status(500).json({ message: "Server Error" });
  }
};
