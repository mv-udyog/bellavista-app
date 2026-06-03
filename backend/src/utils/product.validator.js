import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import addressRoutes from "./routes/address.routes.js";

// MIDDLEWARE
import { limiter } from "./middleware/rateLimiter.js";

// INIT APP (MUST BE FIRST)
const app = express();

/**
 * =========================
 * GLOBAL MIDDLEWARE
 * =========================
 */

// Security
app.use(helmet());

// Rate limiting (protect against abuse)
app.use(limiter);

// CORS (adjust in production)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing
app.use(express.json());

// Cookies
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MV Udyog API is running 🚀",
  });
});

/**
 * =========================
 * API ROUTES
 * =========================
 */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

/**
 * =========================
 * 404 HANDLER
 * =========================
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * =========================
 * GLOBAL ERROR HANDLER
 * =========================
 */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;