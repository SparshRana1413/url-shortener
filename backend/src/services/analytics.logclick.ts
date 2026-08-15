import type { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';
import pool from '../config/db.js';

export default async function logclick(
    headers: Request['headers'],
    urlId: number
): Promise<void> {
    try {
        // 1. Get client IP address
        const rawIp = headers['x-forwarded-for']
            ? (headers['x-forwarded-for'] as string)
                .split(',')[0]
                ?.trim()
            : headers['x-real-ip'] as string | undefined;

        // Localhost fallback for testing
        const clientIp =
            rawIp === '::1' ||
            rawIp === '127.0.0.1' ||
            !rawIp
                ? null
                : rawIp;

        const geo = clientIp
            ? geoip.lookup(clientIp)
            : null;

        const geoLocation: string | null = geo
            ? [geo.country, geo.region, geo.city]
                .filter(Boolean)
                .join(', ')
            : null;

        // 3. Parse User-Agent
        const userAgentHeader = headers['user-agent'] || '';

        const parser = new UAParser(userAgentHeader);
        const uaResult = parser.getResult();

        const deviceType: string =
            uaResult.device.type || 'desktop';

        const os: string | null =
            uaResult.os.name || null;

        const browser: string | null =
            uaResult.browser.name || null;

        // 4. Insert click into PostgreSQL
        const query = `
            INSERT INTO clicks (
                url_id,
                geo_location,
                device_type,
                os,
                browser
            )
            VALUES ($1, $2, $3, $4, $5);
        `;

        const values = [
            urlId,
            geoLocation,
            deviceType,
            os,
            browser,
        ];

        await pool.query(query, values);

    } catch (error) {
        // Analytics failure should never break the redirect
        console.error('Error logging click:', error);
    }
}