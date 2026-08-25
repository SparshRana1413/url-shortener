import type { Request, Response, NextFunction } from "express";
import { GetUrlAnalytics } from "../services/url.analytics.js";

type AnalyticsQuery = {
    range?: string;
};

export default async function analytics(
    req: Request<{ shortcode: string }, {}, {}, AnalyticsQuery>,
    res: Response,
    next: NextFunction
) {
    try {
        const { shortcode } = req.params;
        const range = req.query.range ?? "7d";

        if (!["1d", "7d", "30d", "90d"].includes(range)) {
            return res.status(400).json({
                success: false,
                message: "Invalid range. Use 1d, 7d, 30d, or 90d.",
            });
        }

        const userId = req.user.sub;

        const data = await GetUrlAnalytics(
            shortcode,
            userId,
            range as "1d" | "7d" | "30d" | "90d"
        );

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}