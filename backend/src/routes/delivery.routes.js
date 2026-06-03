import express from "express";
import { 
  getMyOrders, 
  updateOrderStatus // New: Essential for real-time tracking
} from "../controllers/delivery.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * DELIVERY PARTNER SECURITY
 * Only users with the 'DELIVERY' role can access these logistics routes.
 */
router.use(protect, authorize("DELIVERY"));

// 1. Fetch all Bellavista orders currently assigned to the logged-in partner
router.get("/orders", getMyOrders);

// 2. Update order status (e.g., marking as 'DELIVERED')
// This is a PATCH/PUT because we are only changing the 'status' field
router.patch("/update-status", updateOrderStatus);

export default router;