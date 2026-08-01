import type { Request, Response } from 'express';
import {UAParser} from 'ua-parser-js';
import geoip from 'geoip-lite';
import pool from '../config/db.js'; // Replace with your Postgres pool import path

export default async function logclick(req: Request, res: Response): Promise<void> {
  try {
    const { urlId } = req.body; // Assuming url_id is passed in the request body (or adjust to req.params/req.query)

    if (!urlId) {
      res.status(400).json({ error: 'url_id is required' });
      return;
    }

    // 1. Get Client IP Address (handling proxies)
    const rawIp = (req.headers['x-forwarded-for'] as string)
      ? (req.headers['x-forwarded-for'] as string).split(',')[0]?.trim()
      : req.ip;

    // Localhost fallback for testing (8.8.8.8 is a public IP used so geoip doesn't return null locally)
    const clientIp = (rawIp === '::1' || rawIp === '127.0.0.1' || !rawIp) 
      ? '8.8.8.8' 
      : rawIp;

    // 2. Extract Geo Location (e.g., 'US, California, San Francisco' or Country Code 'US')
    const geo = geoip.lookup(clientIp);
    const geoLocation: string | null = geo 
      ? [geo.country, geo.region, geo.city].filter(Boolean).join(', ')
      : null;

    // 3. Parse User-Agent Header for OS, Browser, Device
    const userAgentHeader = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgentHeader);
    const uaResult = parser.getResult();

    const deviceType: string = uaResult.device.type || 'desktop'; // Defaults to 'desktop' if undefined
    const os: string | null = uaResult.os.name || null;
    const browser: string | null = uaResult.browser.name || null;

    // 4. Insert into PostgreSQL clicks table
    // Note: clicked_at uses DEFAULT CURRENT_TIMESTAMP from the table definition
    const query = `
      INSERT INTO clicks (url_id, geo_location, device_type, os, browser)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, clicked_at;
    `;

    const values = [urlId, geoLocation, deviceType, os, browser];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Click logged successfully',
      click: result.rows[0],
    });
  } catch (error) {
    console.error('Error logging click:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}