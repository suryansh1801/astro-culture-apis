import { ZodiacSign } from "./zodiacCalculator";

const horoscopeData: Record<ZodiacSign, string> = {
  Aries:
    "Today is a day for bold moves, Aries. Your energy is high, so channel it into something productive.",
  Taurus:
    "Patience is your virtue today, Taurus. Good things are coming, but you must wait for them.",
  Gemini:
    "Communication is key. A conversation you have today could open up new and exciting doors.",
  Cancer:
    "Focus on home and family. Your emotional intuition is strong, so trust your gut feelings.",
  Leo: "Your creativity is off the charts! It's a perfect day to start a new artistic project, Leo.",
  Virgo:
    "Organization will bring you peace. Tidy up your space and your mind will follow.",
  Libra:
    "Balance is needed in a key relationship. Seek harmony and compromise for the best outcome.",
  Scorpio:
    "A mystery may be solved today. Your investigative skills are sharp, so dig deep.",
  Sagittarius:
    "Adventure is calling! Even a small change in routine can feel like a grand journey.",
  Capricorn:
    "Your hard work is about to pay off. Keep your focus on your long-term goals.",
  Aquarius:
    "A brilliant idea will strike when you least expect it. Be ready to capture it.",
  Pisces:
    "Listen to your dreams. Your subconscious is trying to tell you something important.",
  Unknown: "Your stars are aligning in mysterious ways today.",
};

export const getDailyHoroscope = (zodiacSign: ZodiacSign): string => {
  return horoscopeData[zodiacSign] || horoscopeData["Unknown"];
};
