import express from "express";
import {
register,
login,
firebaseLogin,
} from "../controllers/auth.controller.js";
import { limiter } from "../middleware/rateLimiter.js";

/**

* PUBLIC AUTHENTICATION GATEWAY
* Protects Bellavista & Ozaano user data.
  */
  const router = express.Router();

// 1. Account Creation
router.post("/register", limiter, register);

// 2. Secure Login
router.post("/login", limiter, login);

// 3. Firebase OTP Login
router.post("/firebase-login", limiter, firebaseLogin);

export default router;
