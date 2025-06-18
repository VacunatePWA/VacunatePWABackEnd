import { Router } from "express";
import { VaccineController } from "../controllers/Vaccine.controller.ts";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addVaccine, deleteVaccine, getAllVaccines, updateVaccine } =
  VaccineController;

router.get("/vaccines", getAllVaccines);
router.post("/vaccine", addVaccine);
router.put("/vaccine", updateVaccine);
router.delete("/vaccine", deleteVaccine);

export { router as vaccineRouter };
