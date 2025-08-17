import { ZodiacSign } from "./zodiacCalculator";

const horoscopeData: Record<ZodiacSign, string[]> = {
  Aries: [
    "Today is a day for bold moves, Aries. Your energy is high, so channel it into something productive.",
    "A new challenge will present itself. Embrace it with your natural courage and enthusiasm.",
    "Patience might be required in a personal matter. Don't rush to conclusions.",
    "Financial opportunities are on the horizon. Keep your eyes open and act decisively.",
  ],
  Taurus: [
    "Patience is your virtue today, Taurus. Good things are coming, but you must wait for them.",
    "Focus on comfort and stability. It's a great day to enjoy the simple pleasures of life.",
    "A practical approach to a problem will yield the best results. Trust your common sense.",
    "Someone close to you may need your reliable and steady support. Be there for them.",
  ],
  Gemini: [
    "Communication is key. A conversation you have today could open up new and exciting doors.",
    "Your curiosity will lead you down an interesting path. Explore new ideas and subjects.",
    "Adaptability is your strength. Be prepared to change plans at a moment's notice.",
    "Social connections are highlighted. Reach out to friends and expand your network.",
  ],
  Cancer: [
    "Focus on home and family. Your emotional intuition is strong, so trust your gut feelings.",
    "Nurture your relationships and your own well-being. Self-care is a priority.",
    "A wave of nostalgia may bring valuable insights from your past. Reflect and learn.",
    "Your protective instincts are sharp today. Create a safe and comfortable space for yourself.",
  ],
  Leo: [
    "Your creativity is off the charts! It's a perfect day to start a new artistic project, Leo.",
    "Step into the spotlight. Your natural charisma will shine and draw others to you.",
    "Generosity will bring you joy. Share your time or resources with someone in need.",
    "A leadership opportunity may arise. Don't hesitate to take charge and inspire others.",
  ],
  Virgo: [
    "Organization will bring you peace. Tidy up your space and your mind will follow.",
    "Pay attention to the details. Your meticulous nature will help you avoid a costly mistake.",
    "Focus on health and wellness routines. Small, positive changes can make a big difference.",
    "Your analytical skills are needed to solve a complex problem. Trust your logic.",
  ],
  Libra: [
    "Balance is needed in a key relationship. Seek harmony and compromise for the best outcome.",
    "Your appreciation for beauty is heightened. Surround yourself with art and nature.",
    "A decision requires a fair and objective perspective. Weigh all your options carefully.",
    "Diplomacy will help you navigate a tricky social situation. Choose your words wisely.",
  ],
  Scorpio: [
    "A mystery may be solved today. Your investigative skills are sharp, so dig deep.",
    "Transformation is in the air. Let go of what no longer serves you to make room for the new.",
    "Your passion and intensity can be a powerful force for good. Channel it constructively.",
    "Trust your powerful intuition. If something feels off, it probably is.",
  ],
  Sagittarius: [
    "Adventure is calling! Even a small change in routine can feel like a grand journey.",
    "Your optimism is contagious. Share your positive outlook with those around you.",
    "Expand your horizons through learning or travel. New knowledge awaits you.",
    "Honesty is the best policy, but deliver your truth with a dose of kindness.",
  ],
  Capricorn: [
    "Your hard work is about to pay off. Keep your focus on your long-term goals.",
    "Discipline and persistence are your greatest assets today. Stay the course.",
    "A practical and strategic plan will help you achieve a significant milestone.",
    "Take time to celebrate your accomplishments, no matter how small they seem.",
  ],
  Aquarius: [
    "A brilliant idea will strike when you least expect it. Be ready to capture it.",
    "Your humanitarian side is calling. Find a way to contribute to a cause you care about.",
    "Embrace your individuality. Your unique perspective is your greatest strength.",
    "Connect with like-minded people. Collaboration could lead to something amazing.",
  ],
  Pisces: [
    "Listen to your dreams. Your subconscious is trying to tell you something important.",
    "Your compassion and empathy are needed. Offer a listening ear to a friend.",
    "Allow your imagination to roam free. Creativity is your escape and your power.",
    "Go with the flow today. Resisting change will only cause unnecessary stress.",
  ],
  Unknown: [
    "Your stars are aligning in mysterious ways today.",
    "The cosmos has a unique message just for you, waiting to be discovered.",
    "Look for signs from the universe; they are all around you.",
  ],
};

export const getDailyHoroscope = (zodiacSign: ZodiacSign): string => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  console.log(startOfYear, "startOfYear");
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Fallback to "Unknown" if the sign doesn't exist in our data
  const horoscopesForSign =
    horoscopeData[zodiacSign] || horoscopeData["Unknown"];

  // Use the day of the year to pick an index from the array
  const index = dayOfYear % horoscopesForSign.length;

  return horoscopesForSign[index];
};
