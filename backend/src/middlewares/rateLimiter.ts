import type { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.js';

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 10;

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = `ratelimit:shorten:${req.ip}`;

    // Increment the number of requests from this IP
    const currentCount = await redisClient.incr(key);

    // First request starts the 60-second window
    if (currentCount === 1) {
      await redisClient.expire(key, WINDOW_SECONDS);
    }

    // Too many requests within the current window
    if (currentCount > MAX_REQUESTS) {
      const ttl = await redisClient.ttl(key);
      const retryAfter = ttl > 0 ? ttl : WINDOW_SECONDS;

      res.setHeader('Retry-After', retryAfter);

      return res.status(429).json({
        success: false,
        error: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};