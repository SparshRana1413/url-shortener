import { Router } from "express"; 
import redirect from "../controllers/url.redirect.js";

const router = Router();

router.get("/", redirect);

export default router;