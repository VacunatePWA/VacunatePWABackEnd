import { Router } from "express";
import { ClinicController } from "../controllers/Clinic.controller.ts";

const router: Router = Router();

const { addClinic, deleteClinic, getAllClinics, updateClinic } =
  ClinicController;

router.get("/clinics", getAllClinics);
router.post("/clinic", addClinic);
router.put("/clinic", updateClinic);
router.delete("/clinic", deleteClinic);

export { router as clinicRouter };
