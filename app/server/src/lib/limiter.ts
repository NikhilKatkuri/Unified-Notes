import rateLimit from "express-rate-limit";
import { ENV } from "./env.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: ENV.isProduction ? 100 : 1000,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
    retryAfter: 15 * 60 * 1000,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

export default limiter;
