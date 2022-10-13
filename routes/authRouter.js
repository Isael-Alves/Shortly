import { Router } from "express";
import valitadeSchema from "../middlewares/valitationMiddleware.js";
import { signIn, signUp } from "../controllers/authController.js";
import signUpSchema from "../schemas/schemaSignUp.js";
import signInSchema from "../schemas/schemaSignIn.js";


const router = Router();

router.post("/signup", valitadeSchema(signUpSchema), signUp);
router.post("/signin", valitadeSchema(signInSchema), signIn);

export default router;
