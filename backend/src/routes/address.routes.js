import express from "express";
import {
  createAddress,
  getAllAddresses,
  updateAddress, // Added from the updated controller
  removeAddress  // Added from the updated controller
} from "../controllers/address.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * ADDRESS SECURITY LAYER
 * All routes below this require a valid Bearer Token
 */
router.use(protect);

// 1. Fetch all saved locations for the logged-in user
router.get("/", getAllAddresses);

// 2. Add a new location (e.g., Home, Office, Other)
router.post("/", createAddress);

// 3. Edit an existing location (Pro Feature)
router.put("/:addressId", updateAddress);

// 4. Remove a location (Pro Feature)
router.delete("/:addressId", removeAddress);

export default router;