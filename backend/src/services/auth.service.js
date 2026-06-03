import bcrypt from "bcrypt";
import prisma from "../config/db.js";
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from "../utils/token.js";

/**
 * PRO-LEVEL REGISTER
 * Atomic transaction ensures every user starts with a Bellavista shopping cart.
 */
export const registerUser = async (userData) => {
  const { name, identifier, password, method } = userData;

  // 1. Check for existing user (prevents duplicate accounts)
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: method === "phone" ? identifier : undefined },
        { email: method === "email" ? identifier : undefined },
      ],
    },
  });

  if (existingUser) {
    throw new Error(`An account with this ${method} already exists.`);
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. ATOMIC TRANSACTION: Create User + Cart together
  const newUser = await prisma.$transaction(async (tx) => {
    return await tx.user.create({
      data: {
        name,
        password: hashedPassword,
        [method === "phone" ? "phone" : "email"]: identifier,
        role: "CUSTOMER", 
        cart: {
          create: {}, 
        },
      },
      include: {
        cart: {
          include: { items: true } 
        },
      },
    });
  });

  // 4. Generate Session Tokens
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

/**
 * PRO-LEVEL LOGIN
 * Flexible authentication: Works for Phone or Email automatically.
 */
export const loginUser = async (identifier, password) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: identifier },
        { email: identifier },
      ],
    },
    include: {
      cart: {
        include: { items: { include: { product: true } } } 
      },
    },
  });

  if (!user) {
    throw new Error("No account found with these credentials.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password. Please try again.");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

/**
 * REFRESH TOKEN LOGIC (Pro Feature)
 * Keeps users logged in without requiring a password every 15 minutes.
 */
export const refreshUserSession = async (token) => {
  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    throw new Error("Session expired. Please log in again.");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new Error("User no longer exists.");
  }

  // Generate a fresh access token
  const newAccessToken = generateAccessToken(user);

  return { accessToken: newAccessToken };
};