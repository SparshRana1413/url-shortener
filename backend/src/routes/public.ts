import { Router } from "express"; 
import redirect from "../controllers/url.redirect.js"; // (or wherever your handler is)

const router = Router(); // 👈 YOU ARE MISSING THIS INSTANTIATION!

router.get("/", redirect);

export default router;