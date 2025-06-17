import { Router } from "express";
import { GuardianChildController } from "../controllers/GuardianChild.controller.ts";

const router: Router = Router();

const {addRelation, deleteRelation, getAllRelations, updateRelation } = GuardianChildController;

router.get("/relations", getAllRelations);
router.post("/relation", addRelation);
router.put("/relation", updateRelation);
router.delete("/relation", deleteRelation);

export { router as GuardianChildRouter };
