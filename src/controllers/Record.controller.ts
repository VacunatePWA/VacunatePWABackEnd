import { Request, Response } from "express";
import { AddRecordDTO } from "../DTOs/AddRecordDTO";
import prisma from "../db/prisma";

export class RecordController {
  static async getAllRecords(req: Request, res: Response): Promise<any> {
    try {
      const records = await prisma.record.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(records);
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

      const child = await prisma.child.findUnique({
        where: { 
          identification: identificationChild,
          active: true 
        },
      });
      if (!child) return res.status(404).json({ message: "Child not found or inactive" });

      const user = await prisma.user.findUnique({
        where: { 
          identification: identificationUser,
          active: true 
        },
      });
      if (!user) return res.status(404).json({ message: "User not found or inactive" });

      const vaccine = await prisma.vaccine.findUnique({
        where: { 
          name: vaccineName,
          active: true 
        },
      });
      if (!vaccine) return res.status(404).json({ message: "Vaccine not found or inactive" });

      const newRecord = await prisma.record.create({
        data: {
          childId: child.idChild,
          userId: user.idUser,
          vaccineId: vaccine.idVaccine,
          dosesApplied,
          notes,
          active: true,
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

      const child = await prisma.child.findUnique({
        where: { 
          identification: identificationChild,
          active: true 
        },
      });
      if (!child) return res.status(404).json({ message: "Child not found or inactive" });

      const user = await prisma.user.findUnique({
        where: { 
          identification: identificationUser,
          active: true 
        },
      });
      if (!user) return res.status(404).json({ message: "User not found or inactive" });

      const vaccine = await prisma.vaccine.findUnique({
        where: { 
          name: vaccineName,
          active: true 
        },
      });
      if (!vaccine) return res.status(404).json({ message: "Vaccine not found or inactive" });

      const record = await prisma.record.findFirst({
        where: {
          childId: child.idChild,
          userId: user.idUser,
          vaccineId: vaccine.idVaccine,
          active: true,
        },
      });

      if (!record) {
        return res.status(404).json({ message: "Active record not found." });
      }

      const updatedRecord = await prisma.record.update({
        where: { idRecord: record.idRecord },
        data: {
          dosesApplied,
          notes,
        },
      });

      return res.status(200).json({ 
        message: "Record updated successfully.", 
        updatedRecord 
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteRecord(req: Request, res: Response): Promise<any> {
    try {
      const {
        identificationChild,
        identificationUser,
        vaccineName,
      } = req.body as {
        identificationChild: string;
        identificationUser: string;
        vaccineName: string;
      };

      const child = await prisma.child.findUnique({
        where: { 
          identification: identificationChild,
          active: true 
        },
      });
      if (!child) return res.status(404).json({ message: "Child not found or inactive" });

      const user = await prisma.user.findUnique({
        where: { 
          identification: identificationUser,
          active: true 
        },
      });
      if (!user) return res.status(404).json({ message: "User not found or inactive" });

      const vaccine = await prisma.vaccine.findUnique({
        where: { 
          name: vaccineName,
          active: true 
        },
      });
      if (!vaccine) return res.status(404).json({ message: "Vaccine not found or inactive" });

      const record = await prisma.record.findFirst({
        where: {
          childId: child.idChild,
          userId: user.idUser,
          vaccineId: vaccine.idVaccine,
          active: true,
        },
      });

      if (!record) {
        return res.status(404).json({ message: "Active record not found." });
      }

      await prisma.record.update({
        where: { idRecord: record.idRecord },
        data: {
          active: false,
        },
      });

      return res.status(200).json({ message: "Record deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new RecordController();