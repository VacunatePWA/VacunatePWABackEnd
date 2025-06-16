import { Router } from "express";
import { ClinicController } from "../controllers/Clinic.controller.ts";

const router: Router = Router();

const { addclinic, deleteclinic, getAllclinics, updateclinic } =
  ClinicController;

router.get("/clinics", getAllclinics);
router.post("/clinic", addclinic);
router.put("/clinic", updateclinic);
router.delete("/clinic", deleteclinic);

export { router as clinicRouter };
