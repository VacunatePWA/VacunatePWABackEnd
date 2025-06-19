import { Router } from "express";
import { VaccineSchemaController } from "../controllers/VaccineSchema.controller";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addVaccineSchema, getAllVaccineSchemas, updateVaccineSchema, deleteVaccineSchema } =
  VaccineSchemaController;

// CRUD de esquema de vacunación
router.get("/vaccineSchemas", getAllVaccineSchemas);
router.post("/vaccineSchema", addVaccineSchema);
router.put("/vaccineSchema", updateVaccineSchema);
router.delete("/vaccineSchema", deleteVaccineSchema);

export { router as vaccineSchemaRouter };
