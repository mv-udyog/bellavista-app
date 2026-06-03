import { registerUser, loginUser } from "../services/auth.service.js";

/**
 * PRO-LEVEL REGISTER
 * Handles both Phone & Email registration
 */
export const register = async (req, res) => {
  try {
    const { name, identifier, password, method } = req.body;

    // ✅ Validation (VERY IMPORTANT)
    if (!name || !identifier || !password || !method) {
      return res.status(400).json({
        success: false,
        error:
          "All fields are required: name, identifier (email/phone), password, method",
      });
    }

    if (!["email", "phone"].includes(method)) {
      return res.status(400).json({
        success: false,
        error: "Method must be either 'email' or 'phone'",
      });
    }

    // Optional: basic validation
    if (method === "email" && !identifier.includes("@")) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    if (method === "phone" && identifier.length !== 10) {
      return res.status(400).json({
        success: false,
        error: "Phone number must be 10 digits",
      });
    }

    const result = await registerUser({
      name,
      identifier,
      password,
      method,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      ...result,
    });
  } catch (err) {
    console.error("Signup Controller Error:", err.message);

    res.status(400).json({
      success: false,
      error: err.message || "Registration failed",
    });
  }
};

/**
 * PRO-LEVEL LOGIN
 * Allows login via phone OR email
 */
export const login = async (req, res) => {
  try {
    const { identifier, password, method } = req.body;

    // ✅ Validation
    if (!identifier || !password || !method) {
      return res.status(400).json({
        success: false,
        error:
          "All fields are required: identifier (email/phone), password, method",
      });
    }

    if (!["email", "phone"].includes(method)) {
      return res.status(400).json({
        success: false,
        error: "Method must be either 'email' or 'phone'",
      });
    }

    const data = await loginUser(identifier, password, method);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      ...data,
    });
  } catch (err) {
    console.error("Login Controller Error:", err.message);

    res.status(401).json({
      success: false,
      error: err.message || "Login failed",
    });
  }
};