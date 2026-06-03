import express from "express";
import { 
  getProducts, 
  getProductById, // New: For the product detail page
  addProduct, 
  updateProduct,  // New: For changing prices/stock
  deleteProduct   // New: For removing items
} from "../controllers/product.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * PUBLIC ROUTES
 * Anyone can see the Bellavista catalog without logging in
 */
router.get("/", getProducts);
router.get("/:id", getProductById);

/**
 * ADMIN ONLY ROUTES
 * Only MV Udyog staff can manage the inventory
 */
router.post("/", protect, authorize("ADMIN"), addProduct);
router.put("/:id", protect, authorize("ADMIN"), updateProduct);
router.delete("/:id", protect, authorize("ADMIN"), deleteProduct);

export default router;