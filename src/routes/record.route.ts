import { Router } from "express";
import { RecordController } from "../controllers/Record.controller.ts";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addRecord, getAllRecords, updateRecord } =
  RecordController;

router.get("/records", getAllRecords);
router.post("/record", addRecord);
router.put("/record", updateRecord);

export { router as recordRouter };
