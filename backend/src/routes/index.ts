import { Router } from "express";
import authRoutes from "./auth.js";
// import userRoutes from "./user.js";
// import urlRoutes from "./url.js";
import systemRoutes from "./system.js"

const router = Router();

router.use('/api/system', systemRoutes);
router.use('/api/auth', authRoutes);
// router.use('/api/user', userRoutes);
// router.use('/api/url', urlRoutes);

export default router;