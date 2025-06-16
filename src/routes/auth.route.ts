import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import userSchema from "../schemas/user.schema";

const router: Router = Router();

const {register, logIn, logOut} = AuthController;

router.post("/register",validateSchema(userSchema), register);
router.post("/login", logIn);
router.post("/logout", logOut);

export { router as authRouter };
