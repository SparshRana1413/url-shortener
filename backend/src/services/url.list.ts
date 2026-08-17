import pool from "../config/db.js";

interface ListUrlsParams {
  userId: number;
  page: number;
  limit: number;
}

export async function listUserUrls({
  userId,
  page,
  limit,
}: ListUrlsParams) {
  const offset = (page - 1) * limit;

  const urlsResult = await pool.query(
    `
    SELECT
      id,
      short_code,
      long_url,
      is_active,
      expires_at,
      click_count,
      created_at
    FROM urls
    WHERE user_id = $1
      AND is_active = TRUE
    ORDER BY created_at DESC
    LIMIT $2
    OFFSET $3
    `,
    [userId, limit, offset]
  );

  const totalResult = await pool.query(
    `
    SELECT COUNT(*)::int AS total
    FROM urls
    WHERE user_id = $1
      AND is_active = TRUE
    `,
    [userId]
  );

  const total = totalResult.rows[0].total;

  return {
    urls: urlsResult.rows,
    total,
  };
}