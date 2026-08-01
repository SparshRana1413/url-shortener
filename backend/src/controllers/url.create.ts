import type { NextFunction, Request, Response } from "express";

import pool from "../config/db.js";
import redisClient from "../config/redis.js";

import { validateUrl } from "../utils/urlValidator.js";
import { base62Encode } from "../utils/base62Encoder.js";

export default async function shortenUrl(req: Request, res: Response, next: NextFunction) {
  try {
    // Get raw URL from request body
    const { url } = req.body;

    // Make sure a URL was actually provided
    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        error: "URL is required",
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

    /*
     * First create the database entry and get its generated ID.
     *
     * We need the ID because our short code is:
     *
     *      database ID -> Base62 -> short code
     */
    const insertResult = await pool.query(
      `
        INSERT INTO urls (long_url)
        VALUES ($1)
        RETURNING id, created_at
      `,
      [originalUrl],
    );

    const urlRow = insertResult.rows[0];

    if (!urlRow) {
      throw new Error("Failed to create URL");
    }

    // Convert the database ID into our Base62 short code
    const shortCode = base62Encode(urlRow.id);

    // Store the generated short code on the URL entry
    await pool.query(
      `
        UPDATE urls
        SET short_code = $1
        WHERE id = $2
      `,
      [shortCode, urlRow.id],
    );

    // Cache the redirect in Redis
    await redisClient.set(`url:${shortCode}`, originalUrl);

    // URL successfully shortened
    return res.status(201).json({
      success: true,
      data: {
        shortCode,
        originalUrl,
        createdAt: urlRow.created_at,
      },
    });
  } catch (error) {
    return next(error);
  }
}