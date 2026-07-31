import { Router } from "express";
import shortenUrl from "../controllers/url.create.js";

const router = Router();

router.post('/create', shortenUrl);

export default router;