import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (
    err,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // PostgreSQL unique violation
    if (err.code === "23505") {
        return res.status(409).json({
            success: false,
            error: "Resource already exists",
        });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }
    

    // Application errors with an explicit status code
    if (err.statusCode) {
        if(err.statusCode === 403){
            return res.status(403).json({
                success: false,
                error: "Forbidden"
            })
        }
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }

    // Fallback
    console.error(err);
    return res.status(500).json({
        success: false,
        error: "Internal Server error",
    });
};

export default errorHandler;