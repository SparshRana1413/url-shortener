import type { Request, Response, NextFunction } from "express";
import { DeactivateUrl } from "../services/url.deactivate.js";

export default async function deactivateUrl(
    req: Request<{ shortCode: string }>,
    res: Response,
    next: NextFunction
) {
    try {
        const { shortCode } = req.params;

        await DeactivateUrl(shortCode, req.user.sub);

        return res.status(200).json({
            success: true,
            message: "URL deactivated successfully"
        });
    } catch (error: any) {
        if(error.statusCode == 403){
            return res.status(403).json({
                success: false,
                message:"forbidden"
            })
        }
        next(error);
    }
}