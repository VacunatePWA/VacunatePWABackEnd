import { Router } from "express";
import { UserChildController } from "../controllers/UserChild.controller";
import { validateAccess } from "../middlewares/auth.middleware";

const router = Router();

router.use(validateAccess);

const { addRelation, putRelationInactive, getAllRelations } = UserChildController;

router.get("/user-child", getAllRelations);
router.post("/user-child", addRelation);
router.delete("/user-child", putRelationInactive);

export { router as userChildRouter };
