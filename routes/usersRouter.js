import { Router } from "express";
import valitationToken from "../middlewares/valitationToken.js";
import getMyUser from "../controllers/urlsUserController.js";

const router = Router();

router.get("/user/me", valitationToken, getMyUser);

export default router;
