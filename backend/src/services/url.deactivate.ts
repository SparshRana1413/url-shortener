import pool from "../config/db.js";
import redis from "../config/redis.js";

export async function DeactivateUrl(
    shortCode: string,
    userId: number
): Promise<void> {

    // Verify ownership and deactivate in one query.
    const result = await pool.query(
        `
        UPDATE urls
        SET is_active = FALSE
        WHERE short_code = $1
          AND user_id = $2
          AND is_active = TRUE
        RETURNING id
        `,
        [shortCode, userId]
    );

    // No matching row means either:
    // - URL doesn't exist
    // - URL belongs to another user
    // - URL is already inactive
    
    // For this endpoint, we don't expose which case it is.
    if (result.rowCount === 0) {
        throw Object.assign(
            new Error("You do not have permission to deactivate this URL"),
            { statusCode: 403 }
        );
    }

    // Invalidate redirect cache.
    await redis.del(`url:${shortCode}`);
}