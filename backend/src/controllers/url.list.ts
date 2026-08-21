import type { NextFunction, Request, Response } from "express";
import { listUserUrls } from "../services/url.list.js";

export default async function listUrls(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.sub;

    const pageParam = Number(req.query.page ?? 1);
    const limitParam = Number(req.query.limit ?? 20);

    if (!Number.isInteger(pageParam) || pageParam < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    if (
      !Number.isInteger(limitParam) ||
      limitParam < 1 ||
      limitParam > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Limit must be an integer between 1 and 100",
      });
    }

    const { urls, total } = await listUserUrls({
      userId,
      page: pageParam,
      limit: limitParam,
    });

    const totalPages = Math.ceil(total / limitParam);

    const baseUrl =
      process.env.BASE_URL ?? `${req.protocol}://${req.get("host")}`;

    const formattedUrls = urls.map((url) => ({
      id: url.id,
      shortCode: url.short_code,
      shortUrl: `${baseUrl}/${url.short_code}`,
      originalUrl: url.long_url,
      clickCount: url.click_count,
      createdAt: url.created_at,
      expiresAt: url.expires_at,
    }));

    return res.status(200).json({
      success: true,
      data: {
        urls: formattedUrls,
        pagination: {
          page: pageParam,
          limit: limitParam,
          total,
          totalPages,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}