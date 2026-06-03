import * as deliveryService from "../services/delivery.service.js";

/**
 * PRO-LEVEL DELIVERY OPERATIONS
 * Access restricted to users with Role: DELIVERY
 */

/**
 * GET ASSIGNED ORDERS
 * Shows only the orders assigned to the logged-in delivery partner
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await deliveryService.getAssignedOrders(req.user.id);

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching assigned orders",
    });
  }
};

/**
 * UPDATE ORDER STATUS (Pro Feature)
 * Allows the partner to mark orders as 'OUT_FOR_DELIVERY' or 'DELIVERED'
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validation: Only allow specific statuses to be set by delivery partners
    const allowedStatuses = ["OUT_FOR_DELIVERY", "DELIVERED"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status update for delivery personnel",
      });
    }

    const updatedOrder = await deliveryService.updateStatus(
      req.user.id,
      orderId,
      status
    );

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};