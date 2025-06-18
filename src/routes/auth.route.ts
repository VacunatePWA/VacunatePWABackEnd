import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import userSchema from "../schemas/user.schema";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

const { register, logIn, logOut, profile } = AuthController;

router.post("/register", validateSchema(userSchema), register);
router.post("/login", logIn);
router.post("/logout",validateAccess, logOut);
router.get("/profile",validateAccess, profile);

export { router as authRouter };

