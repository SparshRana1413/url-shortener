import { Router } from "express";
import shortenUrl from "../controllers/url.create.js";
import listUrls from "../controllers/url.list.js";
import requireAuthAPI from "../middlewares/authenticate.js";
import deactivateUrl from "../controllers/url.deactivate.js";
import analytics from "../controllers/url.analytics.js";

const router = Router();

router.post("/create", shortenUrl);
router.get("/", listUrls);
router.delete("/:shortCode", deactivateUrl);
router.get("/:shortcode/analytics", analytics);
export default router;