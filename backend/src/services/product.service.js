import prisma from "../config/db.js";

/**
 * GET ALL PRODUCTS
 * Supports brand filtering (Case-Insensitive) for Bellavista/Ozaano.
 * Only shows products marked as 'isActive'.
 */
export const getAllProducts = async (brand) => {
  return prisma.product.findMany({
    where: {
      isActive: true,
      // If a brand is passed, apply the filter. 
      // If no brand is passed, fetch all active products.
      ...(brand && {
        brand: {
          equals: brand,
          mode: "insensitive", // Matches 'ozaano', 'Ozaano', etc.
        },
      }),
    },
    orderBy: { 
      price: "asc" // Displays 200ml/250ml before 1L bottles
    },
  });
};

/**
 * GET SINGLE PRODUCT
 * Fetches a specific water bottle/jar by its unique ID
 */
export const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

/**
 * CREATE PRODUCT (Admin Only)
 * Adds a new item (Bellavista or Ozaano) to the store
 */
export const createProduct = async (data) => {
  return prisma.product.create({
    data: {
      ...data,
      isActive: true, // New products are active by default
    },
  });
};

/**
 * UPDATE PRODUCT
 * Used for changing prices, updating stock levels, or editing descriptions
 */
export const updateProduct = async (id, data) => {
  return prisma.product.update({
    where: { id },
    data: data,
  });
};

/**
 * REMOVE PRODUCT (Soft Delete)
 * Marks a product as inactive so it stays in Order History 
 * but disappears from the customer-facing store.
 */
export const removeProduct = async (id) => {
  return prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
};