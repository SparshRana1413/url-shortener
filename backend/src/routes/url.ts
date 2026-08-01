import { Router } from "express";
import shortenUrl from "../controllers/url.create.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post('/create', rateLimiter, shortenUrl);

export default router;