import { Router } from "express";
import { RoleController } from "../controllers/Role.controller";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addRole, deleteRole, getAllRoles, updateRole, getRoleById } = RoleController;

router.get("/roles", getAllRoles);
router.get("/rol/:roleId", getRoleById); 
router.post("/role", addRole);
router.put("/role", updateRole);
router.delete("/role", deleteRole);

export { router as roleRouter };
