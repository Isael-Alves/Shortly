import { Router } from "express";
import {
  getConsultSessions,
  urlsShorten,
  openShortUrl,
  deleteUrl,
} from "../controllers/UrlsController.js";
import urlSchema from "../schemas/schemaURL.js";
import validateSchema from "../middlewares/valitationMiddleware.js";
import valitationToken from "../middlewares/valitationToken.js";

const router = Router();

router.post("/urls/shorten", validateSchema(urlSchema), urlsShorten);
router.get("/urls/:id", getConsultSessions);
router.get("/urls/open/:shortUrl", openShortUrl);
router.delete("/urls/:id", valitationToken, deleteUrl);

export default router;
