import prisma from "../config/db.js";

/**
 * PRO-LEVEL ADDRESS SERVICE
 * Manages delivery locations for Bellavista customers
 */

/**
 * ADD ADDRESS
 * Saves a new location and links it to the User
 */
export const addAddress = async (userId, data) => {
  // Pro Tip: If this is the user's first address, we could automatically 
  // set a 'isDefault: true' flag here if your schema supports it.
  return prisma.address.create({
    data: {
      ...data,
      userId,
    },
  });
};

/**
 * GET ALL ADDRESSES
 * Returns the most recently added addresses first
 */
export const getAddresses = async (userId) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * UPDATE ADDRESS (Pro Feature)
 * Updates specific fields like Pincode or House Number
 */
export const updateAddress = async (userId, addressId, data) => {
  // Safety Check: Ensure the address actually belongs to the user
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new Error("Address not found or unauthorized access");
  }

  return prisma.address.update({
    where: { id: addressId },
    data: data,
  });
};

/**
 * DELETE ADDRESS
 * Removes the location from the user's profile
 */
export const deleteAddress = async (userId, addressId) => {
  // Safety Check: Prevent accidental deletion of someone else's data
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new Error("Address not found or unauthorized access");
  }

  return prisma.address.delete({
    where: { id: addressId },
  });
};