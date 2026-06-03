import * as productService from "../services/product.service.js";

/**
 * REPLACE FULL FILE WITH THIS
 * PRO-LEVEL PRODUCT MANAGEMENT
 * Handles the inventory for Bellavista (1L, 200ml) and Ozaano (1L, 250ml)
 */

/**
 * GET ALL PRODUCTS
 * Returns all active products. Supports brand filtering via query params.
 * Example: /api/products?brand=Ozaano
 */
export const getProducts = async (req, res) => {
  try {
    const { brand } = req.query; 
    const products = await productService.getAllProducts(brand);
    
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Error loading products",
      error: err.message 
    });
  }
};

/**
 * GET SINGLE PRODUCT
 * Used for the Product Detail Page
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * ADD PRODUCT (Admin Only)
 */
export const addProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "New product added to inventory",
      data: product,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * UPDATE PRODUCT
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct(id, req.body);
    
    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * DELETE/DEACTIVATE PRODUCT
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productService.removeProduct(id);
    
    res.json({
      success: true,
      message: "Product removed from store",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};