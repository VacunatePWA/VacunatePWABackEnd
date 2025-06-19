import { Router } from "express";
import { UserChildController } from "../controllers/UserChild.controller";

const router = Router();

const { addRelation, putRelationInactive, getAllRelations } = UserChildController;

router.get("/user-child", getAllRelations);
router.post("/user-child", addRelation);
router.delete("/user-child", putRelationInactive);

export { router as userChildRouter };
