import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";

const router: Router = Router();

// router.post("/register", AuthController.register);
// router.post("/login");
// router.post("/logout");

export { router as authRouter };
