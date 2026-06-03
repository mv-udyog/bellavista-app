import * as adminService from "../services/admin.service.js";

/**
 * PRO-LEVEL ADMIN COMMANDS
 * Access restricted to users with Role: ADMIN
 */

/**
 * GET ALL USERS
 * View your entire customer base
 */
export const getUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

/**
 * GET ALL ORDERS
 * View every Bellavista order placed
 */
export const getOrders = async (req, res) => {
  try {
    const orders = await adminService.getAllOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

/**
 * ASSIGN DELIVERY
 * Link an order to a specific Delivery Partner
 */
export const assignDelivery = async (req, res) => {
  try {
    const { orderId, deliveryUserId } = req.body;
    
    if (!orderId || !deliveryUserId) {
      return res.status(400).json({ success: false, message: "Order ID and Delivery User ID are required" });
    }

    const updated = await adminService.assignDelivery(orderId, deliveryUserId);

    res.json({
      success: true,
      message: "Delivery partner assigned successfully",
      data: updated,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * DASHBOARD STATS
 * The "Big Picture" view of your business revenue and growth
 */
export const getStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error calculating stats" });
  }
};