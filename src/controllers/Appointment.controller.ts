import { Request, Response } from "express";
import { AddAppointmentDTO } from "../DTOs/AddAppointmentDTO";
import prisma from "../db/prisma";

export class AppointmentController {
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
        clinicName,
        identificationChild,
        identificationUser,
      } = req.body as AddAppointmentDTO;

      const child = await prisma.child.findUnique({
        where: { identification: identificationChild },
      });

      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }

      const user = await prisma.user.findUnique({
        where: { identification: identificationUser },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const clinic = await prisma.clinic.findUnique({
        where: { name: clinicName },
      });

      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
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
      date,
      notes,
      state,
      clinicName,
      identificationChild,
      identificationUser,
    } = req.body as AddAppointmentDTO;

    try {
      const child = await prisma.child.findUnique({
        where: { identification: identificationChild },
      });
      if (!child) return res.status(404).json({ message: "Child not found" });

      const user = await prisma.user.findUnique({
        where: { identification: identificationUser },
      });
      if (!user) return res.status(404).json({ message: "User not found" });

      const clinic = await prisma.clinic.findUnique({
        where: { name: clinicName },
      });
      if (!clinic) return res.status(404).json({ message: "Clinic not found" });

      const appointment = await prisma.appointment.findFirst({
        where: {
          childId: child.idChild,
          userId: user.idUser,
          clinicId: clinic.idClinic,
          active: true,
          date: date,
        },
      });

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { idAppointment: appointment.idAppointment },
        data: {
          notes: notes ?? appointment.notes,
          state: state ?? appointment.state,
          date: date ?? appointment.date,
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
      const { date, identificationChild, identificationUser, clinicName } =
        req.body as AddAppointmentDTO;

      const child = await prisma.child.findUnique({
        where: { identification: identificationChild },
      });
      if (!child) return res.status(404).json({ message: "Child not found" });

      const user = await prisma.user.findUnique({
        where: { identification: identificationUser },
      });
      if (!user) return res.status(404).json({ message: "User not found" });

      const clinic = await prisma.clinic.findUnique({
        where: { name: clinicName },
      });
      if (!clinic) return res.status(404).json({ message: "Clinic not found" });

      const appointment = await prisma.appointment.findFirst({
        where: {
          childId: child.idChild,
          userId: user.idUser,
          clinicId: clinic.idClinic,
          date,
        },
      });

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found." });
      }

      await prisma.appointment.delete({
        where: { idAppointment: appointment.idAppointment },
      });

      return res
        .status(200)
        .json({ message: "Appointment deleted successfully." });
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
