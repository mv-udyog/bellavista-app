import prisma from "../config/db.js";

/**
 * PRO-LEVEL CART SERVICE
 * Manages the real-time shopping basket for Bellavista customers
 */

/**
 * GET CART
 * Returns the cart with all product details (Name, Price, Image)
 */
export const getCart = async (userId) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: "asc" }, // Keeps the list stable in the UI
      },
    },
  });
};

/**
 * ADD TO CART
 * Handles brand new items or increments existing ones
 */
export const addToCart = async (userId, productId, quantity) => {
  // 1. Availability Check
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product || !product.isActive) {
    throw new Error("This Bellavista product is currently unavailable.");
  }

  // 2. Ensure Cart exists for the user
  let cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  // 3. Logic: Update existing or Create new
  return prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity }, // Pro Tip: Atomic increment prevents math errors
    },
    create: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

/**
 * UPDATE QUANTITY (Pro Feature)
 * Essential for the +/- buttons in your React frontend
 */
export const updateQuantity = async (userId, productId, quantity) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  
  if (!cart) throw new Error("Cart not found");

  // If quantity is 0 or less, remove the item entirely
  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }

  return prisma.cartItem.update({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    data: { quantity },
  });
};

/**
 * REMOVE FROM CART
 * Completely deletes a product line from the basket
 */
export const removeFromCart = async (userId, productId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });

  if (!cart) throw new Error("Cart not found");

  return prisma.cartItem.delete({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });
};