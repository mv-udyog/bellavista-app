import prisma from "../config/db.js";

/**
 * PRO-LEVEL ORDER ENGINE
 * Handles inventory, pricing, and lifecycle for Bellavista orders
 */

/**
 * CREATE ORDER
 * Atomic transaction: Validates, Deducts Stock, Creates Order, Clears Cart
 */
export const createOrder = async (userId, addressId, paymentMethod = "COD") => {
  // 1. Fetch current cart with details
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty. Add some Bellavista to continue!");
  }

  // 2. Pre-calculation & Validation
  let totalAmount = 0;
  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      throw new Error(`${item.product?.name || "A product"} is no longer available.`);
    }

    if (item.product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`);
    }

    totalAmount += item.product.price * item.quantity;
  }

  // 3. EXECUTE TRANSACTION
  return await prisma.$transaction(async (tx) => {
    // A. Create the Order and its Items
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId,
        totalAmount,
        paymentMethod,
        status: "PLACED",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
        address: true,
      },
    });

    // B. Bulk Update Stock (Atomic Decrement)
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    // C. Wipe Cart Items (Not the Cart itself, just the contents)
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });
};

/**
 * GET USER ORDERS
 * Returns chronological history of purchases
 */
export const getUserOrders = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * GET ORDER DETAILS (Pro Feature)
 * Fetches a single order with verification to ensure the user owns it
 */
export const getOrderDetails = async (userId, orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      address: true,
    },
  });

  if (!order || order.userId !== userId) {
    throw new Error("Order not found or access denied.");
  }

  return order;
};

/**
 * UPDATE ORDER STATUS
 * Controlled lifecycle management for Admin and Delivery
 */
export const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ["PLACED", "CONFIRMED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}`);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { user: true }, // Useful for triggering email/SMS notifications later
  });
};