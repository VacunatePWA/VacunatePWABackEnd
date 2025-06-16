import { Router } from "express";
import { GuardianController } from "../controllers/Guardian.controller.ts";

const router: Router = Router();

const { addguardian, deleteguardian, getAllguardians, updateguardian } =
  GuardianController;

router.get("/guardians", getAllguardians);
router.post("/guardian", addguardian);
router.put("/guardian", updateguardian);
router.delete("/guardian", deleteguardian);

export { router as guardianRouter };
