import type { NextFunction, Request, Response } from "express";
import { RegisterUser } from "../services/auth.register.js";
import {
    validateEmail,
    validateUsername,
    validatePassword
} from "../services/auth.validate.js";
import jwt from "jsonwebtoken";

export default async function signup(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { username, password } = req.body;
        const rawEmail = req.body.email;
        // Required fields
        if (!username || !rawEmail || !password) {
            return res.status(400).json({
                error: "All fields are required."
            });
        }

        const email = rawEmail.trim().toLowerCase();

        // Validate email
        const emailError = validateEmail(email);

        if (emailError) {
            return res.status(400).json({
                message: emailError
            });
        }

        // Validate username
        const usernameError = validateUsername(username);

        if (usernameError) {
            return res.status(400).json({
                message: usernameError
            });
        }

        // Validate password
        const passwordError = validatePassword(password);

        if (passwordError) {
            return res.status(400).json({
                message: passwordError
            });
        }

        // Business logic
        const newUser = await RegisterUser({
            username,
            email,
            password
        });

        const secret = process.env.JWT_SIGNATURE;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }

        const token = jwt.sign(
            { sub: newUser.id, email: newUser.email },
            secret,
            { expiresIn: "1h" }
        );

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: newUser
        });

    } catch (error: any) {

        if (error.message === "USERNAME_TAKEN") {
            return res.status(409).json({
                error: "Username is already taken."
            });
        }

        if (error.message === "EMAIL_TAKEN") {
            return res.status(409).json({
                error: "Email is already registered."
            });
        }

        return next(error);
    }
}
