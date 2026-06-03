import * as addressService from "../services/address.service.js";

/**
 * CREATE ADDRESS
 * Adds a new location to the user's profile
 */
export const createAddress = async (req, res) => {
  try {
    // req.user.id comes from your Auth Middleware (JWT)
    const address = await addressService.addAddress(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: address,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET ALL ADDRESSES
 * Fetches every saved location for the logged-in user
 */
export const getAllAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getAddresses(req.user.id);

    res.json({
      success: true,
      count: addresses.length,
      data: addresses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Could not fetch addresses",
    });
  }
};

/**
 * UPDATE ADDRESS (Pro Feature)
 * Allows users to edit their saved locations
 */
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updatedAddress = await addressService.updateAddress(
      req.user.id, 
      addressId, 
      req.body
    );

    res.json({
      success: true,
      message: "Address updated",
      data: updatedAddress,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * DELETE ADDRESS (Pro Feature)
 * Removes an address from the profile
 */
export const removeAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    await addressService.deleteAddress(req.user.id, addressId);

    res.json({
      success: true,
      message: "Address removed",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};