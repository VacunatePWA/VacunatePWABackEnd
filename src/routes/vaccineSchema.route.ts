import { Router } from "express";
import { VaccineSchemaController } from "../controllers/VaccineSchema.controller.ts";

const router: Router = Router();

const { addVaccineSchema, getAllVaccineSchemas, updateVaccineSchema } =
  VaccineSchemaController;

router.get("/vaccineSchemas", getAllVaccineSchemas);
router.post("/vaccineSchema", addVaccineSchema);
router.put("/vaccineSchema", updateVaccineSchema);

export { router as vaccineSchemaRouter };
