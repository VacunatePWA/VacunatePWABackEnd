import { Router } from "express";
import { ChildController } from "../controllers/Child.controller.ts";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addChild, deleteChild, getAllChilds, updateChild, getChildCount } =
  ChildController;

router.get("/childs/count", getChildCount);
router.get("/childs", getAllChilds);
router.post("/child", addChild);
router.put("/child", updateChild);
router.delete("/child", deleteChild);

export { router as childRouter };
