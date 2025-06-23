import { Router } from "express";
import { RecordController } from "../controllers/Record.controller";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addRecord, getAllRecords, updateRecord, deleteRecord, getRecordsByChild } =
  RecordController;

router.get("/records", getAllRecords);
router.get("/records/child/:childId", getRecordsByChild);
router.post("/record", addRecord);
router.put("/record", updateRecord);
router.delete("/record", deleteRecord);

export { router as recordRouter };
