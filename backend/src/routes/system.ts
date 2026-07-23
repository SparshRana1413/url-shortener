import { Router } from "express";
import Health from "../controllers/system.health.js";

const router = Router();

router.get("/health", Health);

export default router;