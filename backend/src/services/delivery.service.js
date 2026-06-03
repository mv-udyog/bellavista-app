import prisma from "../config/db.js";

/**
 * PRO-LEVEL DELIVERY ENGINE
 * Manages the workflow for the Bellavista delivery team
 */

/**
 * GET ASSIGNED ORDERS
 * Filters orders specifically assigned to the logged-in delivery partner
 */
export const getAssignedOrders = async (deliveryUserId) => {
  return prisma.order.findMany({
    where: { 
      deliveryId: deliveryUserId,
      // Pro-Tip: We usually hide 'CANCELLED' or 'DELIVERED' 
      // from the main active list to keep the UI clean.
      status: { notIn: ["CANCELLED"] } 
    },
    include: {
      items: true,
      address: true,
      user: {
        select: {
          name: true,
          phone: true, // Crucial so the driver can call the customer
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * UPDATE ORDER STATUS (Pro Feature)
 * The core action a delivery partner takes on the road
 */
export const updateStatus = async (deliveryUserId, orderId, status) => {
  // 1. Safety Check: Verify this order is actually assigned to THIS driver
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order || order.deliveryId !== deliveryUserId) {
    throw new Error("You are not authorized to update this order.");
  }

  // 2. Perform the Update
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      address: true,
      items: true
    }
  });
};