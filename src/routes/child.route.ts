import { Router } from "express";
import { ChildController } from "../controllers/Child.controller.ts";

const router: Router = Router();

const { addChild, deleteChild, getAllChilds, updateChild } =
  ChildController;

router.get("/childs", getAllChilds);
router.post("/child", addChild);
router.put("/child", updateChild);
router.delete("/child", deleteChild);

export { router as childRouter };
