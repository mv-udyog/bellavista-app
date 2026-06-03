import * as orderService from "../services/order.service.js";

/**
 * PLACE ORDER
 * Converts Cart items into a permanent Order
 */
export const placeOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required to place an order.",
      });
    }

    // Pro Tip: We pass req.user.id to ensure the order belongs to the person logged in
    const order = await orderService.createOrder(
      req.user.id,
      addressId,
      paymentMethod || "COD" // Default to Cash on Delivery
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully! Your Bellavista is on the way.",
      data: order,
    });
  } catch (err) {
    console.error("Place Order Error:", err);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to place order",
    });
  }
};

/**
 * GET USER ORDERS (History)
 * Shows a list of all past purchases for the customer
 */
export const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order history",
    });
  }
};

/**
 * GET SINGLE ORDER DETAILS (Pro Feature)
 * Used for the 'Track Order' or 'Invoice' page
 */
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderDetails(req.user.id, orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * UPDATE ORDER STATUS
 * Used by Admin to confirm or by Delivery to mark as delivered
 */
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    const updatedOrder = await orderService.updateOrderStatus(orderId, status);

    res.status(200).json({
      success: true,
      message: `Order is now ${status}`,
      data: updatedOrder,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update status",
    });
  }
};