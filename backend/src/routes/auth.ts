import { Router } from "express";
import signup from "../controllers/auth.signup.js";
const router = Router();
//all /api/auth routes go here

router.post('/signup', signup)

export default router;