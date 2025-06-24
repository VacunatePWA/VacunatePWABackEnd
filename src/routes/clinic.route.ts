import { Router } from "express";
import { ClinicController } from "../controllers/Clinic.controller";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addClinic, deleteClinic, getAllClinics, updateClinic, getClinicCount } =
  ClinicController;

router.get("/clinics/count", getClinicCount);
router.get("/clinics", getAllClinics);
router.post("/clinic", addClinic);
router.put("/clinic", updateClinic);
router.delete("/clinic", deleteClinic);

export { router as clinicRouter };
