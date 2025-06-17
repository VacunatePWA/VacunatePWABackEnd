import { Router } from "express";
import { VaccineSchemaController } from "../controllers/VaccineSchema.controller.ts";

const router: Router = Router();

const { addVaccineSchema, getAllVaccineSchemas, updateVaccineSchema, deleteVaccineSchema } =
  VaccineSchemaController;

router.get("/vaccineSchemas", getAllVaccineSchemas);
router.post("/vaccineSchema", addVaccineSchema);
router.put("/vaccineSchema", updateVaccineSchema);
router.delete("/vaccineSchema", deleteVaccineSchema);

export { router as vaccineSchemaRouter };
