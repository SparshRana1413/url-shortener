import pool from "../config/db.js";

type AnalyticsRange = "1d" | "7d" | "30d" | "90d";

export async function GetUrlAnalytics(
    shortCode: string,
    userId: number,
    range: AnalyticsRange = "7d"
) {
    // 1. Verify ownership
    const urlResult = await pool.query(
        `
        SELECT short_code
        FROM urls
        WHERE short_code = $1 AND user_id = $2
        `,
        [shortCode, userId]
    );

    if (urlResult.rowCount === 0) {
        const error = new Error("You do not own this URL");
        (error as any).statusCode = 403;
        throw error;
    }

    // 2. Calculate number of days
    const days = {
        "1d": 1,
        "7d": 7,
        "30d": 30,
        "90d": 90,
    }[range];

    // 3. Get clicks grouped by day
    const clicksByDayResult = await pool.query(
        `
        SELECT
            DATE(clicked_at) AS date,
            COUNT(*)::int AS count
        FROM clicks
        WHERE url_id = (
            SELECT id
            FROM urls
            WHERE short_code = $1
        )
        AND clicked_at >= CURRENT_DATE - ($2::int - 1)
        GROUP BY DATE(clicked_at)
        ORDER BY DATE(clicked_at)
        `,
        [shortCode, days]
    );

    // 4. Get device breakdown
    const deviceResult = await pool.query(
        `
        SELECT
            LOWER(device_type) AS device,
            COUNT(*)::int AS count
        FROM clicks
        WHERE url_id = (
            SELECT id
            FROM urls
            WHERE short_code = $1
        )
        AND clicked_at >= CURRENT_DATE - ($2::int - 1)
        GROUP BY LOWER(device_type)
        `,
        [shortCode, days]
    );

    // 5. Create every date in the requested range
    const clicksMap = new Map<string, number>();

    for (const row of clicksByDayResult.rows) {
        const date = new Date(row.date)
            .toISOString()
            .split("T")[0]!;

        clicksMap.set(date, row.count);
    }

    const clicksByDay: { date: string; count: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();

        date.setDate(date.getDate() - i);

        const dateString = date.toISOString().split("T")[0]!;

        clicksByDay.push({
            date: dateString,
            count: clicksMap.get(dateString) ?? 0,
        });
    }

    // 6. Build device breakdown
    const deviceBreakdown = {
        mobile: 0,
        desktop: 0,
        tablet: 0,
    };

    for (const row of deviceResult.rows) {
        if (row.device in deviceBreakdown) {
            deviceBreakdown[row.device as keyof typeof deviceBreakdown] =
                row.count;
        }
    }

    // 7. Total clicks for the range
    const totalClicks = clicksByDay.reduce(
        (total, day) => total + day.count,
        0
    );

    return {
        shortCode,
        totalClicks,
        clicksByDay,
        deviceBreakdown,
    };
}