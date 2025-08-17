import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_TIME),
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after a minute!",
});

export default apiLimiter;
