import { Router } from "express";
import { RecordController } from "../controllers/Record.controller.ts";

const router: Router = Router();

const { addRecord, getAllRecords, updateRecord, deleteRecord } =
  RecordController;

router.get("/records", getAllRecords);
router.post("/record", addRecord);
router.put("/record", updateRecord);
router.delete("/record", deleteRecord);

export { router as recordRouter };
