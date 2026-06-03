import express from "express";
import {
  placeOrder,
  getOrders,
  getOrderById, // New: For the Order Detail page
  updateStatus,
} from "../controllers/order.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * CUSTOMER ORDER ROUTES
 * These require a logged-in user
 */
router.use(protect); // Global protection for all order routes

// 1. Place a new order (Checkout)
router.post("/", placeOrder);

// 2. View full order history
router.get("/", getOrders);

// 3. View a specific order detail (Pro Feature)
router.get("/:orderId", getOrderById);

/**
 * LOGISTICS & ADMIN ROUTES
 * Only staff can change the status of an order
 */
router.put(
  "/status", 
  authorize("ADMIN", "DELIVERY"), // Secure the "Pro" way
  updateStatus
);

export default router;