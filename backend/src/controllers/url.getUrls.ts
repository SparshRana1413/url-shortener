import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

export default function getUrls(req: Request, res: Response, next: NextFunction){

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    try{
        const userData = jwt.verify(token!, process.env.JWT_SECRET!);
        
    } catch(error){

        // catch-all error
        return next(error);
    }
}