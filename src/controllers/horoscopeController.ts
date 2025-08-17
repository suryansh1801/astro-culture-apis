import { Request, RequestHandler, Response } from "express";
import logger from "../utils/logger";
import HoroscopeHistory from "../models/HoroscopeHistory";
import { getDailyHoroscope, ZodiacSign } from "../utils/horoscopeData";

export const getTodaysHoroscope: RequestHandler = async (
  req: Request,
  res: Response
) => {
  if (req.user) {
    logger.info("Horoscope fetch attempt", {
      userId: req.user._id,
      zodiacSign: req.user.zodiacSign,
    });
  }
  try {
    if (!req.user) {
      logger.error("User not found", { route: "getTodaysHoroscope" });
      return res.status(401).json({ message: "User not found" });
    }

    const { _id: userId, zodiacSign } = req.user;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let history = await HoroscopeHistory.findOne({ userId, date: today });

    if (history) {
      return res.json({
        date: today.toISOString().split("T")[0],
        zodiacSign: history.zodiacSign,
        horoscope: history.horoscopeText,
      });
    }

    const horoscope = getDailyHoroscope(zodiacSign as ZodiacSign);

    // Save to history
    const newHistory = new HoroscopeHistory({ userId, zodiacSign, horoscope });
    await newHistory.save();
    logger.info("Horoscope delivered", { userId, zodiacSign });

    res.status(200).json({ zodiacSign, horoscope });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getHoroscopeHistory: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "User not found" });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const history = await HoroscopeHistory.find({
      userId: req.user._id,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: -1 });

    res.json(
      history.map((h) => ({
        date: h.date.toISOString().split("T")[0],
        zodiacSign: h.zodiacSign,
        horoscope: h.horoscopeText,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
