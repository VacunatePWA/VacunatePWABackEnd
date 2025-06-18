import { Router } from "express";
import { VaccineSchemaController } from "../controllers/VaccineSchema.controller.ts";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addVaccineSchema, getAllVaccineSchemas, updateVaccineSchema } =
  VaccineSchemaController;

router.get("/vaccineSchemas", getAllVaccineSchemas);
router.post("/vaccineSchema", addVaccineSchema);
router.put("/vaccineSchema", updateVaccineSchema);

export { router as vaccineSchemaRouter };
