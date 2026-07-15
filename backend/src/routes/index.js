import { Router } from "express";
import authRoutes from "./auth.js";
import userRoutes from "./user.js";
import urlRoutes from "./url.js";

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/user', userRoutes);
router.use('/api/url', urlRoutes);

export default router;