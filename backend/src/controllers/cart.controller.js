import * as cartService from "../services/cart.service.js";

/**
 * PRO-LEVEL CART MANAGEMENT
 * Linked to the logged-in user's unique ID
 */

/**
 * VIEW CART
 * Returns all items, product details, and the current subtotal
 */
export const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json({
      success: true,
      data: cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

/**
 * ADD ITEM
 * Adds a new product or increases quantity if it already exists
 */
export const addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ success: false, message: "Product and quantity required" });
    }

    const item = await cartService.addToCart(req.user.id, productId, quantity);

    res.json({
      success: true,
      message: "Added to your Bellavista cart",
      data: item,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * UPDATE QUANTITY (Pro Feature)
 * Essential for the +/- buttons in the UI
 */
export const updateItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const updatedItem = await cartService.updateQuantity(req.user.id, productId, quantity);

    res.json({
      success: true,
      message: "Cart updated",
      data: updatedItem,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * REMOVE ITEM
 * Completely removes a product from the cart
 */
export const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    await cartService.removeFromCart(req.user.id, productId);

    res.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};