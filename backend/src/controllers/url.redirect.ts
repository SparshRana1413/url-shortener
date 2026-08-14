import type { NextFunction, Request, Response } from "express";

import redisClient from "../config/redis.js";
import pool from "../config/db.js";

interface RedirectParams {
    shortcode: string;
}

interface UrlRecord {
    long_url: string;
}

export default async function redirect(
    req: Request<RedirectParams>,
    res: Response,
    next: NextFunction
) {
    try {
        // Get shortcode from URL parameters
        const shortcode = req.params.shortcode;

        // Check Redis first
        // GET returns null if the shortcode does not exist
        const cachedUrl = await redisClient.get(`url:${shortcode}`);

        // Cache hit: redirect immediately without querying PostgreSQL
        if (cachedUrl) {
            return res.redirect(302, cachedUrl);
        }

        // Cache miss: look for the shortcode in PostgreSQL
        const queryText = `
            SELECT long_url
            FROM urls
            WHERE short_code = $1
            LIMIT 1
        `;

        // $1 maps to the first element in [shortcode]
        const result = await pool.query<UrlRecord>(
            queryText,
            [shortcode]
        );

        // Get the URL record returned by PostgreSQL
        const urlRecord = result.rows[0];

        // Shortcode doesn't exist or has no destination URL
        if (!urlRecord || !urlRecord.long_url) {
            return res.status(404).json({
                success: false,
                error: "Short URL not found",
            });
        }

        const originalUrl = urlRecord.long_url;

        // Repopulate Redis after a cache miss
        await redisClient.set(shortcode, originalUrl);

        // Redirect visitor to the original URL
        return res.redirect(302, originalUrl);

    } catch (error) {
        return next(error);
    }
}