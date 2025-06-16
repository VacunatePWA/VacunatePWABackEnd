import { Router } from "express";
import { ChildController } from "../controllers/Child.controller.ts";

const router: Router = Router();

const { addchild, deletechild, getAllchilds, updatechild } =
  ChildController;

router.get("/childs", getAllchilds);
router.post("/child", addchild);
router.put("/child", updatechild);
router.delete("/child", deletechild);

export { router as childRouter };
