import { Router } from "express";
import { AppointmentController } from "../controllers/Appointment.controller.ts";

const router: Router = Router();

const { addAppointment, deleteAppointment, getAllAppointments, updateAppointment } =
  AppointmentController;

router.get("/appointments", getAllAppointments);
router.post("/appointment", addAppointment);
router.put("/appointment", updateAppointment);
router.delete("/appointment", deleteAppointment);

export { router as appointmentRouter };
