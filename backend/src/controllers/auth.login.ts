import type { Request, Response } from "express";
import { loginUser } from '../services/auth.loginUser.js';

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default async function login(req: Request, res: Response){
    
    try {
        const {email, password} = req.body;

        // if(typeof email !== "string"){
        //     return res.status(400).json({
        //         success: false,
        //         error: "Bad Request",
        //         message: "Email needs to be a string"
        //     })
        // }

        // if(typeof password !== "string"){
        //     return res.status(400).json({
        //         success: false,
        //         error: "Bad Request",
        //         message: "Password needs to be a string"
        //     })
        // }

        // const normalizedEmail: string = email.trim().toLowerCase();

        if(!email){
            return res.status(400).json({
                success: false,
                error: "Bad Request",
                message: "Email is required"
            })
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                error: "Bad Request",
                message: "Invalid email format"
            });
        }

        if (!password || password.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Password is required.'
        });
        }

        const user = await loginUser({ email, password });

        return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: user
        });
    } catch (error: any){
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Invalid email or password.'
            });
        }

        console.error('Login Internal Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Something went wrong on our end. Please try again later.'
        });
    }
}