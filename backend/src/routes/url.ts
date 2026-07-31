import { Router } from "express";
import shortenUrl from "../controllers/url.createShortURL.js";

const router = Router();

router.post('/create', shortenUrl);

export default router;