import { Request, Response } from "express";
import { AddAppointmentDTO } from "../DTOs/AddAppointmentDTO";
import prisma from "../db/prisma";

export class AppointmentController {

  static async getAllAppointments(req: Request, res: Response): Promise<any> {
    try {
      const Appointments = await prisma.appointment.findMany({
        where: { active: true },
        include: {
          child: {
            include: {
              guardianChildren: {
                include: {
                  guardian: true
                }
              }
            }
          },
          user: true,
          clinic: true
        },
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
    try {
      console.log('📝 UPDATE APPOINTMENT REQUEST BODY:', req.body);
      
      const {
        idAppointment,
        date,
        notes,
        state,
        clinicId,
        identificationChild,
        identificationUser
      } = req.body;

      if (!idAppointment) {
        return res.status(400).json({ message: "idAppointment is required" });
      }

      // Validar formato UUID si es necesario
      if (typeof idAppointment !== 'string') {
        return res.status(400).json({ message: "idAppointment must be a string" });
      }

      const appointment = await prisma.appointment.findUnique({
        where: { idAppointment },
      });

      if (!appointment || !appointment.active) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      console.log('📝 EXISTING APPOINTMENT:', appointment);

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

      // Validar y obtener nuevo paciente si se proporciona
      let newChildId = appointment.childId;
      if (identificationChild) {
        console.log('🔍 Looking for child with identification:', identificationChild);
        const child = await prisma.child.findFirst({
          where: { identification: identificationChild, active: true },
        });
        if (!child) {
          return res.status(404).json({ message: "Child not found" });
        }
        console.log('✅ Found child:', child);
        newChildId = child.idChild;
      }

      // Validar y obtener nuevo usuario si se proporciona
      let newUserId = appointment.userId;
      if (identificationUser) {
        console.log('🔍 Looking for user with identification:', identificationUser);
        const user = await prisma.user.findFirst({
          where: { identification: identificationUser, active: true },
        });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        console.log('✅ Found user:', user);
        newUserId = user.idUser;
      }

      // Validar que no exista una cita duplicada con los nuevos datos
      if (identificationChild || identificationUser || clinicId || date) {
        const duplicateCheck = await prisma.appointment.findFirst({
          where: {
            childId: newChildId,
            userId: newUserId,
            clinicId: newClinicId,
            date: date || appointment.date,
            active: true,
            NOT: {
            }
          },
        });

        if (duplicateCheck) {
          return res.status(409).json({ 
            message: "A similar appointment already exists with these parameters" 
          });
        }
      }

      const updateData: any = {
        clinicId: newClinicId,
        childId: newChildId,
        userId: newUserId,
      };

      if (notes !== undefined) updateData.notes = notes;
      if (state !== undefined) updateData.state = state;
      if (date !== undefined) updateData.date = date;

      console.log('📝 UPDATE DATA:', updateData);

      const updatedAppointment = await prisma.appointment.update({
        where: { idAppointment },
        data: updateData,
      });

      console.log('✅ APPOINTMENT UPDATED:', updatedAppointment);

      return res.status(200).json({
        message: "Appointment updated successfully",
        updatedAppointment,
      });
    } catch (error) {
      console.error('❌ Error updating appointment:', error);
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
