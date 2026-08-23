import type { NextFunction, Request, Response } from "express";

import pool from "../config/db.js";
import redisClient from "../config/redis.js";

import { validateUrl } from "../utils/urlValidator.js";
import { base62Encode } from "../utils/base62Encoder.js";

export default async function shortenUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Get raw URL from request body
    const { url } = req.body;

    // Keep non-string input out of the URL validator. Empty strings are
    // intentionally validated below so its user-facing error is returned.
    if (typeof url !== "string") {
      return res.status(400).json({
        success: false,
        error: "URL can't be empty",
      });
    }

    // Validate and normalize the URL
    const validation = validateUrl(url);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    const originalUrl = validation.url;
    const userId = req.user.sub;

    /*
     * Get the next ID from the PostgreSQL sequence.
     *
     * This gives us the ID that PostgreSQL will use for the
     * next inserted row.
     */
    const sequenceResult = await pool.query(
      `SELECT nextval('urls_id_seq') AS id`,
    );

    const id = sequenceResult.rows[0].id;

    // Convert the ID into our Base62 short code
    const shortCode = base62Encode(id);

    /*
     * Insert everything at once.
     *
     * We already know the ID and short code, so short_code
     * can remain NOT NULL.
     */
    const insertResult = await pool.query(
      `
        INSERT INTO urls (
          id,
          long_url,
          user_id,
          short_code
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, created_at
      `,
      [id, originalUrl, userId, shortCode],
    );

    const urlRow = insertResult.rows[0];

    if (!urlRow) {
      throw new Error("Failed to create URL");
    }

    // Keep create-side cache entries compatible with the redirect cache reader.
    // It needs the database ID for click logging and the expiry value for its
    // safety check, not just the destination URL.
    await redisClient.set(
      `url:${shortCode}`,
      JSON.stringify({
        id: urlRow.id,
        long_url: originalUrl,
        expires_at: null,
      }),
    );

    // URL successfully shortened
    // Development-only short-link base URL. A public domain will be configured
    // when the application is deployed.
    const appBaseUrl = "http://localhost:3000";

    return res.status(201).json({
      success: true,
      data: {
        shortCode,
        shortUrl: `${appBaseUrl}/${shortCode}`,
        originalUrl,
        createdAt: urlRow.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
