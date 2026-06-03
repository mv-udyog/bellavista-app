import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// ROUTE IMPORTS
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import addressRoutes from "./routes/address.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import otpRoutes from "./routes/otp.routes.js";


// MIDDLEWARE IMPORTS
import { limiter } from "./middleware/rateLimiter.js";

// INITIALIZE APP
const app = express();

/**
 * =========================
 * GLOBAL MIDDLEWARE
 * =========================
 */

// 1. Security Headers (Best practice for Production)
app.use(helmet());

// 2. Rate Limiting (Protects Bellavista API from brute force/DDOS)
app.use(limiter);

// 3. CORS Configuration
// Allow your Vite frontend (port 5173) to communicate with this API
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://192.168.1.16:5173",
    credentials: true,
  })
);

// 4. Request Body Parsing
app.use(express.json({ limit: "16kb" })); // Parses incoming JSON
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parses URL-encoded data

// 5. Cookie & Log Management
app.use(cookieParser());
app.use(morgan("dev")); // Console logs for development debugging

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MV Udyog & Bellavista API is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

/**
 * =========================
 * API ROUTES
 * =========================
 */

// User & Product Browsing
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Customer Actions (Protected by 'protect' middleware inside routes)
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);

// Internal Logistics & Management (Protected by 'authorize' middleware)
app.use("/api/admin", adminRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/auth", otpRoutes);

/**
 * =========================
 * ERROR HANDLING
 * =========================
 */

// 1. 404 Handler (When a user hits a non-existent endpoint)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Requested route not found.",
  });
});

// 2. Global Error Handler (Catches all 'throw new Error' from Services/Controllers)
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  
  // Log the error stack to the terminal for debugging
  console.error(`[SERVER ERROR]: ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "An unexpected internal error occurred." 
      : err.message,
  });
});

export default app;