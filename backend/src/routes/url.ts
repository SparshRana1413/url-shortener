import { Router } from "express";
import shortenUrl from "../controllers/url.create.js";
import listUrls from "../controllers/url.list.js";

const router = Router();

router.post("/create", shortenUrl);
router.get("/", listUrls);

export default router;