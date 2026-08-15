import type { NextFunction, Request, Response } from "express";

import redisClient from "../config/redis.js";
import pool from "../config/db.js";
import logclick from "../services/analytics.logclick.js";

interface RedirectParams {
    shortcode: string;
}

interface UrlRecord {
    id: number;
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
        const cachedUrl = await redisClient.get(`url:${shortcode}`);

        // Cache hit
        if (cachedUrl) {
            const urlRecord: UrlRecord = JSON.parse(cachedUrl);

            // Increment total click count asynchronously
            void pool.query(
                `
                    UPDATE urls
                    SET click_count = click_count + 1
                    WHERE id = $1
                `,
                [urlRecord.id]
            );

            // Log detailed analytics asynchronously
            void logclick(req.headers, urlRecord.id);

            // Redirect immediately
            return res.redirect(302, urlRecord.long_url);
        }

        // Cache miss: look for the shortcode in PostgreSQL
        const queryText = `
            SELECT id, long_url
            FROM urls
            WHERE short_code = $1
            LIMIT 1
        `;

        const result = await pool.query<UrlRecord>(
            queryText,
            [shortcode]
        );

        // Shortcode doesn't exist
        const urlRecord = result.rows[0];

        if (!urlRecord || !urlRecord.long_url) {
            return res.status(404).json({
                success: false,
                error: "Short URL not found",
            });
        }

        const originalUrl = urlRecord.long_url;

        // Repopulate Redis after a cache miss
        // Store both the database ID and destination URL
        await redisClient.set(
            `url:${shortcode}`,
            JSON.stringify({
                id: urlRecord.id,
                long_url: originalUrl,
            })
        );

        // Increment total click count asynchronously
        void pool.query(
            `
                UPDATE urls
                SET click_count = click_count + 1
                WHERE id = $1
            `,
            [urlRecord.id]
        );

        // Log detailed analytics asynchronously
        void logclick(req.headers, urlRecord.id);

        // Redirect visitor to the original URL
        return res.redirect(302, originalUrl);

    } catch (error) {
        return next(error);
    }
}