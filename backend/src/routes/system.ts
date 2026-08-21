import { Router } from "express";
import Health from "../controllers/system.health.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.get("/health", Health);

export default router;