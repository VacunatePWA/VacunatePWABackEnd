import { Router } from "express";
import { ChildController } from "../controllers/Child.controller";
import { validateAccess } from "../middlewares/auth.middleware";
import { validateSchema } from "../middlewares/validation.middleware";
import { updateChildWithTutorSchema } from "../schemas/child.schema";

const router: Router = Router();

router.use(validateAccess);

const { addChild, deleteChild, getAllChilds, updateChild, getChildCount, getMyChildren, getVaccinationStatus, generateVaccinationCard, createChildWithTutor, updateChildWithTutor } =
  ChildController;

router.get("/childs/count", getChildCount);
router.get("/children", getAllChilds);
router.get("/children/my-children", getMyChildren);
router.get("/children/:childId/vaccination-status", getVaccinationStatus);
router.get("/children/:childId/vaccination-card", generateVaccinationCard);
router.post("/child", addChild);
router.post("/children/with-tutor", createChildWithTutor);
router.put("/child", updateChild);
router.put("/children/with-tutor", validateSchema(updateChildWithTutorSchema), updateChildWithTutor);
router.delete("/child", deleteChild);

export { router as childRouter };
