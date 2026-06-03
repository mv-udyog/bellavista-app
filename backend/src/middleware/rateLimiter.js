import rateLimit from "express-rate-limit";

/**
 * GENERAL LIMITER
 * For browsing products, reading FAQs, etc.
 * 100 requests per 15 minutes.
 */
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * AUTH LIMITER (Pro Feature)
 * Much stricter to prevent password guessing.
 * 5 attempts per 15 minutes.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, // 10 attempts (gives some room for typos)
  message: {
    success: false,
    message: "Too many login attempts. Please wait 15 minutes for security reasons."
  },
  standardHeaders: true,
  legacyHeaders: false,
});