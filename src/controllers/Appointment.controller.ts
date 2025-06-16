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
        const { date, notes, clinicName, identificationChild, identificationUser } = req.body as AddAppointmentDTO;

        // Buscar el ID del niño
        const child = await prisma.child.findUnique({
        where: { identification: identificationChild },
        });

        if (!child) {
        return res.status(404).json({ message: "Child not found" });
        }

        // Buscar el ID del usuario
        const user = await prisma.user.findUnique({
        where: { identification: identificationUser },
        });

        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        // Buscar el ID de la clínica
        const clinic = await prisma.clinic.findUnique({
        where: { name: clinicName },
        });

        if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
        }

        // Crear la cita
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
        message: error instanceof Error ? error.message : "Internal server error",
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
        // Buscar el niño
        const child = await prisma.child.findUnique({
        where: { identification: identificationChild },
        });
        if (!child) return res.status(404).json({ message: "Child not found" });

        // Buscar el usuario
        const user = await prisma.user.findUnique({
        where: { identification: identificationUser },
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Buscar la clínica
        const clinic = await prisma.clinic.findUnique({
        where: { name: clinicName },
        });
        if (!clinic) return res.status(404).json({ message: "Clinic not found" });

        // Buscar la cita por los 3 IDs y posiblemente la fecha
        const appointment = await prisma.appointment.findFirst({
        where: {
            childId: child.idChild,
            userId: user.idUser,
            clinicId: clinic.idClinic,
            active: true,
            date: date, // si se requiere exactitud en fecha
        },
        });

        if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
        }

        // Actualizar los datos (si se pasan)
        const updatedAppointment = await prisma.appointment.update({
        where: { idAppointment: appointment.idAppointment },
        data: {
            notes: notes ?? appointment.notes,
            state: state ?? appointment.state,
            // si quieres permitir cambiar la fecha, puedes actualizarla aquí
            date: date ?? appointment.date,
        },
        });

        return res.status(200).json({ message: "Appointment updated successfully", updatedAppointment });
    } catch (error) {
        return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
        });
    }
    }

    static async deleteAppointment(req: Request, res: Response): Promise<any> {
    try {
        const {
        date,
        identificationChild,
        identificationUser,
        clinicName,
        } = req.body as AddAppointmentDTO;

        // Buscar al niño
        const child = await prisma.child.findUnique({
        where: { identification: identificationChild },
        });
        if (!child) return res.status(404).json({ message: "Child not found" });

        // Buscar al usuario
        const user = await prisma.user.findUnique({
        where: { identification: identificationUser },
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Buscar la clínica
        const clinic = await prisma.clinic.findUnique({
        where: { name: clinicName },
        });
        if (!clinic) return res.status(404).json({ message: "Clinic not found" });

        // Buscar la cita
        const appointment = await prisma.appointment.findFirst({
        where: {
            childId: child.idChild,
            userId: user.idUser,
            clinicId: clinic.idClinic,
            date,
            active: true,
        },
        });

        if (!appointment) {
        return res.status(404).json({ message: "Appointment not found." });
        }

        // Borrado lógico
        await prisma.appointment.update({
        where: { idAppointment: appointment.idAppointment },
        data: { active: false },
        });

        return res.status(200).json({ message: "Appointment deleted successfully." });
    } catch (error) {
        return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
        });
    }
    }

    }

    export default new AppointmentController();
