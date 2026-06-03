import jwt from "jsonwebtoken";

/**
 * GENERATE ACCESS TOKEN
 * Short-lived (15m) - Used for every API request.
 * Contains 'role' for the Authorize middleware to check permissions.
 */
export const generateAccessToken = (user) => {
  if (!process.env.JWT_ACCESS_SECRET) {
    console.error("CRITICAL: JWT_ACCESS_SECRET is not defined in .env");
  }

  return jwt.sign(
    { 
      id: user.id, 
      role: user.role,
      email: user.email || null // Optional: helps frontend identify user
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};

/**
 * GENERATE REFRESH TOKEN
 * Long-lived (7d) - Used ONLY to get a new access token.
 * Typically stored in a Secure, HttpOnly cookie.
 */
export const generateRefreshToken = (user) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    console.error("CRITICAL: JWT_REFRESH_SECRET is not defined in .env");
  }

  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * VERIFY REFRESH TOKEN (Pro Tip)
 * A helper function to validate the refresh token during the 'refresh' route.
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};