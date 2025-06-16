import { Router } from "express";
import { RecordController } from "../controllers/Record.controller.ts";

const router: Router = Router();

const { addRecord, getAllRecords, updateRecord } =
  RecordController;

router.get("/records", getAllRecords);
router.post("/record", addRecord);
router.put("/record", updateRecord);

export { router as recordRouter };
