import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {

    // Catches postgresql error
    if(err.code === "23505"){
        return res.status(409).json({
            success: false,
            error: "Resource already exists"
        });
    }

    // Handles JWT error
    if(err.name === "JsonWebTokenError"){
        return res.status(401).json({
            success:false,
            error: "Unauthorized",
        })
    }
    if(err.name === "TokenExpiredError"){
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
        })
    }

    
    // fallback for any other errors
    console.error(err);
    return res.status(500).json({
        success: false,
        error: "Internal Server error"
    });
}

export default errorHandler;