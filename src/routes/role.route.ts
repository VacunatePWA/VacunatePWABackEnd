import { Router } from "express";
import { RoleController } from "../controllers/Role.controller.ts";

const router: Router = Router();

const {addRole, deleteRole, getAllRoles, updateRole } = RoleController

router.get("/roles", getAllRoles);
router.post("/role", addRole);
router.put("/role", updateRole);
router.delete("/role", deleteRole);

export { router as roleRouter };
