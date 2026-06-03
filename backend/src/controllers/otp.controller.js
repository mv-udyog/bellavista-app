import { sendOtpService, verifyOtpService } from "../services/otp.service.js";

/**
 * SEND OTP CONTROLLER
 */
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validation
    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        error: "Valid 10-digit phone number required",
      });
    }

    const result = await sendOtpService(phone);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      ...result,
    });
  } catch (error) {
    console.error("Send OTP Error:", error.message);

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * VERIFY OTP CONTROLLER
 */
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        error: "Phone and OTP are required",
      });
    }

    const data = await verifyOtpService(phone, otp);

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...data,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};