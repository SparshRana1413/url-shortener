import { Router } from "express";
import authRoutes from "./auth.js";
import urlRoutes from "./url.js";
import systemRoutes from "./system.js";
import authenticate from "../middlewares/authenticate.js";
import redirect from "../controllers/url.redirect.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// private/public API routes
router.use('/api/system', systemRoutes);
router.use('/api/auth', rateLimiter,authRoutes);
router.use('/api/url', authenticate, rateLimiter, urlRoutes);

// main public /:shortcode route
router.get('/:shortcode', redirect);

export default router;