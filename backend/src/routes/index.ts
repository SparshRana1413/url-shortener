import { Router } from "express";
import authRoutes from "./auth.js";
// import userRoutes from "./user.js";
import urlRoutes from "./url.js";
import systemRoutes from "./system.js";
import authenticate from "../middlewares/authenticate.js";
import redirect from "../controllers/url.redirect.js";

const router = Router();

// main public /:shortcode route
router.use('/:shortcode', redirect);

// private routes
router.use('/api/system', systemRoutes);
router.use('/api/auth', authRoutes);
// router.use('/api/user', userRoutes);
router.use('/api/url', authenticate, urlRoutes);

export default router;