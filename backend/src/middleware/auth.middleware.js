import jwt from "jsonwebtoken";

/**
 * PROTECT MIDDLEWARE
 * Verifies the JWT and attaches the user payload to the request
 */
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if header exists and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please log in to continue.",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token using your secret from .env
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    /* PRO-TIP: We attach the decoded payload to req.user.
       Make sure your token generation includes { id, role, email/phone }.
    */
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    
    // Check if error is specifically due to expiration
    const message = error.name === "TokenExpiredError" 
      ? "Session expired. Please log in again." 
      : "Invalid security token.";

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

/**
 * ROLE-BASED ACCESS
 * Restricts routes to specific roles like 'ADMIN' or 'DELIVERY'
 */
export const authorize = (...roles) => {
  return (req, res, next) => {

    console.log("========== AUTHORIZE ==========");
    console.log("USER:", req.user);
    console.log("USER ROLE:", req.user?.role);
    console.log("ALLOWED ROLES:", roles);
    console.log("===============================");

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    next();
  };
};