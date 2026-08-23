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
    expires_at: string | null;
}

export default async function redirect(
    req: Request<RedirectParams>,
    res: Response,
    next: NextFunction
) {
    try {
        const shortcode = req.params.shortcode;

        // Check Redis first
        const cachedUrl = await redisClient.get(`url:${shortcode}`);

        let cachedRecord: UrlRecord | null = null;

        if (cachedUrl) {
            try {
                cachedRecord = JSON.parse(cachedUrl) as UrlRecord;
            } catch {
                // Entries written before the cache format was standardized only
                // contain the destination URL. Remove them and fetch the full
                // record from PostgreSQL below.
                await redisClient.del(`url:${shortcode}`);
            }
        }

        // Cache hit
        if (cachedRecord) {
            const urlRecord = cachedRecord;

            // Safety check for expiration
            if (
                urlRecord.expires_at &&
                new Date(urlRecord.expires_at) <= new Date()
            ) {
                await redisClient.del(`url:${shortcode}`);

                return res.status(404).json({
                    success: false,
                    error: "Short URL has expired",
                });
            }

            // Increment click count
            void pool.query(
                `
                UPDATE urls
                SET click_count = click_count + 1
                WHERE id = $1
                `,
                [urlRecord.id]
            );

            // Log detailed analytics
            void logclick(req.headers, urlRecord.id);

            return res.redirect(302, urlRecord.long_url);
        }
        // console.log("redis cache miss", shortcode);

        // Cache miss: query PostgreSQL
        const queryText = `
            SELECT
                id,
                long_url,
                expires_at
            FROM urls
            WHERE short_code = $1
              AND is_active = TRUE
              AND (
                  expires_at IS NULL
                  OR expires_at > CURRENT_TIMESTAMP
              )
            LIMIT 1
        `;

        const result = await pool.query<UrlRecord>(
            queryText,
            [shortcode]
        );

        const urlRecord = result.rows[0];

        // URL doesn't exist, is inactive, or has expired
        if (!urlRecord || !urlRecord.long_url) {
            return res.status(404).json({
                success: false,
                error: "Short URL not found",
            });
        }

        // Store URL information in Redis
        const cacheData: UrlRecord = {
            id: urlRecord.id,
            long_url: urlRecord.long_url,
            expires_at: urlRecord.expires_at,
        };

        if (urlRecord.expires_at) {
            const expiresAt = new Date(urlRecord.expires_at);
            const ttlSeconds = Math.ceil(
                (expiresAt.getTime() - Date.now()) / 1000
            );

            if (ttlSeconds > 0) {
                await redisClient.set(
                    `url:${shortcode}`,
                    JSON.stringify(cacheData),
                    {
                        EX: ttlSeconds,
                    }
                );
            }
        } else {
            // No expiration → normal cache entry
            await redisClient.set(
                `url:${shortcode}`,
                JSON.stringify(cacheData)
            );
        }

        // Increment click count
        void pool.query(
            `
            UPDATE urls
            SET click_count = click_count + 1
            WHERE id = $1
            `,
            [urlRecord.id]
        );

        // Log detailed analytics
        void logclick(req.headers, urlRecord.id);

        return res.redirect(302, urlRecord.long_url);

    } catch (error) {
        return next(error);
    }
}
