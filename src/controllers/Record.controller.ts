import { Request, Response } from "express";
import { AddRecordDTO } from "../DTOs/AddRecordDTO";
import prisma from "../db/prisma";

export class RecordController {
  static async getAllRecords(req: Request, res: Response): Promise<any> {
    try {
      const Records = await prisma.record.findMany({
        where: { active: true },

        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(Records);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addRecord(req: Request, res: Response): Promise<any> {
    try {
      const { childId, userId, vaccineId, dosesApplied, notes } = req.body as AddRecordDTO;

      const newRecord = await prisma.record.create({
        data: { childId, userId, vaccineId, dosesApplied, notes },
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
    const { idRecord, childId, userId, vaccineId, dosesApplied, notes } = req.body as AddRecordDTO;

    try {
      const existing = await prisma.record.findUnique({ where: { idRecord } });

      if (!existing) {
        return res.status(404).json({ message: "Record not found." });
      }

      await prisma.record.update({
        where: { idRecord: existing.idRecord },
        data: { childId, userId, vaccineId, dosesApplied, notes },
      });
      return res.status(200).json({ message: "Record updated successfully." });
    } catch (error) {
      console.error("Error updating Record:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
export default new RecordController();
