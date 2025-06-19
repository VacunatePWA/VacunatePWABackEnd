import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import userSchema from "../schemas/user.schema";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

const { register, logIn, logOut, profile, getAllUsers, deleteUser} = AuthController;

router.post("/register", validateSchema(userSchema), register);
router.post("/login", logIn);
router.post("/logout",validateAccess, logOut);
router.get("/profile",validateAccess, profile);
router.get("/users",validateAccess, getAllUsers);
router.delete("/user",validateAccess, deleteUser);



export { router as authRouter };

