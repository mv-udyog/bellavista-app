import express from "express";
import { 
  getCart, 
  addItem, 
  updateItemQuantity, // New: For +/- buttons
  removeItem          // New: To clear an item
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * CART SECURITY LAYER
 * Ensure only the owner of the cart can modify it
 */
router.use(protect);

// 1. View current items and subtotal
router.get("/", getCart);

// 2. Add a new product to the cart
router.post("/add", addItem);

// 3. Change quantity (Pro Feature: Essential for Zepto-style UI)
router.put("/update", updateItemQuantity);

// 4. Remove a specific product from the cart
router.delete("/remove/:productId", removeItem);

export default router;