import { Router } from "express";
import { GuardianController } from "../controllers/Guardian.controller";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { getAvailableTutors, getAllGuardians } = GuardianController;

router.get("/tutors/available", getAvailableTutors);
router.get("/guardians", getAllGuardians);

export { router as guardianRouter };