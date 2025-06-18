import { Router } from "express";
import { AppointmentController } from "../controllers/Appointment.controller.ts";
import { validateAccess } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(validateAccess);

const { addAppointment, deleteAppointment, getAllAppointments, updateAppointment, getAppointmentCount } =
  AppointmentController;

router.get("/appointments/count", getAppointmentCount);
router.get("/appointments", getAllAppointments);
router.post("/appointment", addAppointment);
router.put("/appointment", updateAppointment);
router.delete("/appointment", deleteAppointment);

export { router as appointmentRouter };
