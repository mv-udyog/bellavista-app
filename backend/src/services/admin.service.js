import prisma from "../config/db.js";

/**
 * GET ALL USERS
 */
export const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
};

/**
 * GET ALL ORDERS (GLOBAL)
 */
export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: true,
      items: true,
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * ASSIGN DELIVERY PARTNER
 */
export const assignDelivery = async (orderId, deliveryUserId) => {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      deliveryId: deliveryUserId,
      status: "CONFIRMED",
    },
  });
};

/**
 * GET DASHBOARD STATS
 */
export const getDashboardStats = async () => {
  const totalOrders = await prisma.order.count();

  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
  });

  const activeOrders = await prisma.order.count({
    where: {
      status: {
        in: ["PLACED", "CONFIRMED", "OUT_FOR_DELIVERY"],
      },
    },
  });

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    activeOrders,
  };
};