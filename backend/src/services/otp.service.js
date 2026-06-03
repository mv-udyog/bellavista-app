import prisma from "../config/db.js";
import jwt from "jsonwebtoken";

/**
 * Generate OTP (6 digit)
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * SEND OTP
 */
export const sendOtpService = async (phone) => {
  // Optional: delete old OTPs for same phone (cleanup)
  await prisma.otp.deleteMany({
    where: { phone },
  });

  const otp = generateOtp();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  await prisma.otp.create({
    data: {
      phone,
      otp,
      expiresAt,
    },
  });

  // 🚀 Replace this with SMS service later
  console.log(`🔥 OTP for ${phone}: ${otp}`);

  return { message: "OTP sent successfully" };
};

/**
 * VERIFY OTP
 */
export const verifyOtpService = async (phone, otp) => {
  const record = await prisma.otp.findFirst({
    where: { phone, otp },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new Error("Invalid OTP");
  }

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  // ✅ Delete OTP after successful use (security)
  await prisma.otp.deleteMany({
    where: { phone },
  });

  /**
   * Find existing user
   */
  let user = await prisma.user.findUnique({
    where: { phone },
    include: { cart: true },
  });

  /**
   * Create new user (AUTO NAME FIX APPLIED ✅)
   */
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: `User_${phone.slice(-4)}`, // 🔥 FIXED (no more error)
        phone,
        cart: {
          create: {},
        },
      },
      include: { cart: true },
    });
  }

  /**
   * Generate Tokens
   */
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};