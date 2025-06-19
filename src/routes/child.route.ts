import { Router } from "express";
import { ChildController } from "../controllers/Child.controller";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addChild, deleteChild, getAllChilds, updateChild, getChildCount } =
  ChildController;

router.get("/childs/count", getChildCount);
router.get("/children", getAllChilds);
router.post("/child", addChild);
router.put("/child", updateChild);
router.delete("/child", deleteChild);

export { router as childRouter };
