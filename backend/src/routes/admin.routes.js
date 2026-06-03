import express from "express";
import {
  getUsers,
  getOrders,
  assignDelivery,
  getStats,
  // New "Pro" functions we added to the controller earlier
} from "../controllers/admin.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * ADMIN SECURITY PERIMETER
 * No customer or delivery partner can pass this line.
 */
router.use(protect, authorize("ADMIN"));

// 1. CUSTOMER MANAGEMENT
router.get("/users", getUsers);

// 2. ORDER LOGISTICS
router.get("/orders", getOrders);
router.post("/assign-delivery", assignDelivery);

// 3. BUSINESS INTELLIGENCE
// Provides the "Top Level" view of sales and growth
router.get("/stats", getStats);

export default router;