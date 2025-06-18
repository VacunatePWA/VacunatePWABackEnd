import { Router } from "express";
import { GuardianController } from "../controllers/Guardian.controller.ts";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addGuardian, deleteGuardian, getAllGuardians, updateGuardian } =
  GuardianController;

router.get("/guardians", getAllGuardians);
router.post("/guardian", addGuardian);
router.put("/guardian", updateGuardian);
router.delete("/guardian", deleteGuardian);

export { router as guardianRouter };
