import { Router } from "express";
import { GuardianChildController } from "../controllers/GuardianChild.controller.ts";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addRelation, deleteRelation, getAllRelations, updateRelation } = GuardianChildController;

router.get("/relations", getAllRelations);
router.post("/relation", addRelation);
router.put("/relation", updateRelation);
router.delete("/relation", deleteRelation);

export { router as GuardianChildRouter };
