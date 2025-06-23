import { Request, Response } from "express";
import { AddRecordDTO } from "../DTOs/AddRecordDTO";
import prisma from "../db/prisma";

export class RecordController {
  static async getAllRecords(req: Request, res: Response): Promise<any> {
    try {
      const records = await prisma.record.findMany({
        where: { active: true },
        include: {
          child: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              identification: true
            }
          },
          vaccine: true
        },
        orderBy: { createdAt: "desc" },
      });
      
      return res.status(200).json({
        message: "Registros obtenidos exitosamente",
        data: records
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async getRecordsByChild(req: Request, res: Response): Promise<any> {
    try {
      const { childId } = req.params;
      
      // Buscar el niño por su identificación
      const child = await prisma.child.findFirst({
        where: { identification: childId, active: true },
      });

      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }

      const records = await prisma.record.findMany({
        where: { 
          childId: child.idChild,
          active: true 
        },
        include: {
          child: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              identification: true
            }
          },
          vaccine: true
        },
        orderBy: { dateApplied: "desc" },
      });
      
      // Transformar los datos para el frontend
      const formattedRecords = records.map(record => ({
        identificationChild: record.child.identification,
        identificationUser: record.user.identification,
        vaccineName: record.vaccine.name,
        vaccineType: record.vaccine.brand,
        applicationDate: record.dateApplied,
        doseNumber: record.dosesApplied,
        notes: record.notes,
        userName: `${record.user.firstName} ${record.user.lastName}`,
        createdAt: record.createdAt
      }));

      return res.status(200).json({
        message: "Registros del niño obtenidos exitosamente",
        data: formattedRecords
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addRecord(req: Request, res: Response): Promise<any> {
    try {
      const {
        identificationChild,
        identificationUser,
        vaccineName,
        dosesApplied,
        notes,
      } = req.body as AddRecordDTO;

      const child = await prisma.child.findFirst({
        where: { identification: identificationChild, active: true },
      });
      if (!child) return res.status(404).json({ message: "Child not found" });

      const user = await prisma.user.findFirst({
        where: { identification: identificationUser, active: true },
      });
      if (!user) return res.status(404).json({ message: "User not found" });

      const vaccine = await prisma.vaccine.findFirst({
        where: { name: vaccineName, active: true },
      });
      if (!vaccine) return res.status(404).json({ message: "Vaccine not found" });

      const newRecord = await prisma.record.create({
        data: {
          childId: child.idChild,
          userId: user.idUser,
          vaccineId: vaccine.idVaccine,
          dosesApplied,
          notes,
        },
      });

      return res.status(201).json(newRecord);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateRecord(req: Request, res: Response): Promise<any> {
    try {
      const {
        identificationChild,
        identificationUser,
        vaccineName,
        dosesApplied,
        notes,
      } = req.body as AddRecordDTO;

      const child = await prisma.child.findFirst({
        where: { identification: identificationChild, active: true },
      });
      if (!child) return res.status(404).json({ message: "Child not found" });

      const user = await prisma.user.findFirst({
        where: { identification: identificationUser, active: true },
      });
      if (!user) return res.status(404).json({ message: "User not found" });

      const vaccine = await prisma.vaccine.findFirst({
        where: { name: vaccineName, active: true },
      });
      if (!vaccine) return res.status(404).json({ message: "Vaccine not found" });

      const record = await prisma.record.findFirst({
        where: {
          childId: child.idChild,
          userId: user.idUser,
          vaccineId: vaccine.idVaccine,
          active: true,
        },
      });

      if (!record) {
        return res.status(404).json({ message: "Record not found." });
      }

      await prisma.record.update({
        where: { idRecord: record.idRecord },
        data: {
          dosesApplied,
          notes,
        },
      });

      return res.status(200).json({ message: "Record updated successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteRecord(req: Request, res: Response): Promise<any> {
    try {
      const { identificationChild, identificationUser, vaccineName } = req.body as AddRecordDTO;
      const child = await prisma.child.findFirst({ where: { identification: identificationChild, active: true } });
      if (!child) return res.status(404).json({ message: "Child not found" });
      const user = await prisma.user.findFirst({ where: { identification: identificationUser, active: true } });
      if (!user) return res.status(404).json({ message: "User not found" });
      const vaccine = await prisma.vaccine.findFirst({ where: { name: vaccineName, active: true } });
      if (!vaccine) return res.status(404).json({ message: "Vaccine not found" });
      const record = await prisma.record.findFirst({
        where: {
          childId: child.idChild,
          userId: user.idUser,
          vaccineId: vaccine.idVaccine,
          active: true,
        },
      });
      if (!record) {
        return res.status(404).json({ message: "Record not found." });
      }
      await prisma.record.update({
        where: { idRecord: record.idRecord },
        data: { active: false },
      });
      return res.status(200).json({ message: "Record deleted (set inactive)." });
    } catch (error) {
      return res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
    }
  }
}

export default new RecordController();
