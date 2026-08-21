import type { Request, Response, NextFunction } from "express";
import { LoginUser } from "../services/auth.login.js";
import jwt from "jsonwebtoken";

/**
 * Validates basic email formatting via regex.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // 1. TYPE VALIDATION: Ensure inputs are strings before running string methods like .trim()
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Email and password must be valid text strings.",
      });
    }

    // 2. INPUT VALIDATION & SANITIZATION
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Email is required.",
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Invalid email format.",
      });
    }

    if (!password || password.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Password is required.",
      });
    }

    // 3. AUTHENTICATION SERVICE CALL
    const user = await LoginUser({ email: normalizedEmail, password });

    // 4. ENV SECRET CHECK
    const secret = process.env.JWT_SIGNATURE;
    if (!secret) {
      throw new Error(
        "JWT_SECRET is not defined in environment variables."
      );
    }

    // 5. JWT GENERATION
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );

    // 6. COOKIE CONFIGURATION
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JS from accessing the cookie (XSS protection)
      secure: isProduction, // Uses HTTPS in production, allows HTTP in local development
      sameSite: isProduction ? "lax" : "none", // Allows cross-origin cookies in dev if needed
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // 7. SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: user,
    });
  } catch (error: any) {
    // 8. ERROR HANDLING
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Invalid email or password.",
      });
    }

    if (error.message?.includes("JWT_SECRET is not defined")) {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message,
      });
    }

    return next(error);
  }
}