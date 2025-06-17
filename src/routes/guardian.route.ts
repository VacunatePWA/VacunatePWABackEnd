import { Router } from "express";
import { GuardianController } from "../controllers/Guardian.controller.ts";

const router: Router = Router();

const {
  getChildrenByGuardian,
  addGuardian,
  deleteGuardian,
  getAllGuardians,
  updateGuardian,
} = GuardianController;

router.get("/guardians", getAllGuardians);
router.get("/guardians/:identification/children", getChildrenByGuardian);
router.post("/guardian", addGuardian);
router.put("/guardian", updateGuardian);
router.delete("/guardian", deleteGuardian);

export { router as guardianRouter };
