import { Request, Response } from "express";
import { AddAppointmentDTO } from "../DTOs/AddAppointmentDTO";
import prisma from "../db/prisma";

export class AppointmentController {
  // Métodos: getAllAppointments, addAppointment, updateAppointment, deleteAppointment, getAppointmentCount

  static async getAllAppointments(req: Request, res: Response): Promise<any> {
    try {
      const Appointments = await prisma.appointment.findMany({
        where: { active: true },

        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(Appointments);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addAppointment(req: Request, res: Response): Promise<any> {
    try {
      const {
        date,
        notes,
        clinicId,
        identificationChild,
        identificationUser,
      } = req.body as AddAppointmentDTO;

      const child = await prisma.child.findFirst({
        where: { identification: identificationChild, active: true },
      });
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }

      const user = await prisma.user.findFirst({
        where: { identification: identificationUser, active: true },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const clinic = await prisma.clinic.findUnique({
        where: { idClinic: clinicId, active: true },
      });
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }

      // Validar que no exista una cita activa igual
      const exists = await prisma.appointment.findFirst({
        where: {
          childId: child.idChild,
          userId: user.idUser,
          clinicId: clinic.idClinic,
          date,
          active: true,
        },
      });
      if (exists) {
        return res
          .status(409)
          .json({ message: "Appointment already exists and is active." });
      }

      const newAppointment = await prisma.appointment.create({
        data: {
          date,
          notes,
          childId: child.idChild,
          userId: user.idUser,
          clinicId: clinic.idClinic,
        },
      });

      return res.status(201).json(newAppointment);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateAppointment(req: Request, res: Response): Promise<any> {
    const {
      idAppointment,
      date,
      notes,
      state,
      clinicId
    } = req.body;

    try {
      if (!idAppointment) {
        return res.status(400).json({ message: "idAppointment is required" });
      }

      const appointment = await prisma.appointment.findUnique({
        where: { idAppointment },
      });

      if (!appointment || !appointment.active) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      let newClinicId = appointment.clinicId;
      if (clinicId && clinicId !== appointment.clinicId) {
        const clinic = await prisma.clinic.findUnique({
          where: { idClinic: clinicId, active: true },
        });
        if (!clinic) {
          return res.status(404).json({ message: "Clinic not found" });
        }
        newClinicId = clinicId;
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { idAppointment },
        data: {
          notes: notes ?? appointment.notes,
          state: state ?? appointment.state,
          date: date ?? appointment.date,
          clinicId: newClinicId,
        },
      });

      return res.status(200).json({
        message: "Appointment updated successfully",
        updatedAppointment,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteAppointment(req: Request, res: Response): Promise<any> {
    try {
      const { idAppointment } = req.body;

      if (!idAppointment) {
        return res.status(400).json({ message: "idAppointment is required" });
      }

      const appointment = await prisma.appointment.findUnique({
        where: { idAppointment },
      });

      if (!appointment || !appointment.active) {
        return res.status(404).json({ message: "Appointment not found." });
      }

      await prisma.appointment.update({
        where: { idAppointment },
        data: { active: false },
      });

      return res
        .status(200)
        .json({ message: "Appointment deleted (set inactive)." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async getAppointmentCount(req: Request, res: Response): Promise<any> {
    try {
      const count = await prisma.appointment.count({
        where: { active: true },
      });
      return res.status(200).json({ count });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new AppointmentController();
