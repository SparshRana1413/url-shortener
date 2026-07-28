import { Router } from "express";
import signup from "../controllers/auth.signup.js";
import login from "../controllers/auth.login.js";
const router = Router();
//all /api/auth routes go here

router.post('/signup', signup)
router.post('/login', login)

export default router;