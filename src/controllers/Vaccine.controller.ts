import { Request, Response } from "express";
import { AddVaccineDTO } from "../DTOs/AddVaccineDTO";
import prisma from "../db/prisma";

export class VaccineController {
  static async getAllVaccines(req: Request, res: Response): Promise<any> {
    try {
      const vaccines = await prisma.vaccine.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(vaccines);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addVaccine(req: Request, res: Response): Promise<any> {
    try {
      const { name, brand, description } = req.body as AddVaccineDTO;

      const vaccineFounded = await prisma.vaccine.findUnique({
        where: { name },
      });

      if (vaccineFounded) {
        return res.status(409).json({
          message: `Vaccine "${name}" already exists.`,
        });
      }

      const newVaccine = await prisma.vaccine.create({
        data: { name, brand, description },
      });

      return res.status(201).json(newVaccine);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateVaccine(req: Request, res: Response): Promise<any> {
    const { name, brand, description } = req.body as AddVaccineDTO;

    try {
      const vaccineFounded = await prisma.vaccine.findUnique({ where: { name } });

      if (!vaccineFounded) {
        return res.status(404).json({ message: "Vaccine not found." });
      }

      const updatedVaccine = await prisma.vaccine.update({
        where: { idVaccine: vaccineFounded.idVaccine },
        data: { name, brand, description },
      });

      return res.status(200).json({ 
        message: "Vaccine updated successfully.",
        updatedVaccine 
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteVaccine(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body as { name: string };

      const vaccineFounded = await prisma.vaccine.findUnique({ where: { name } });

      if (!vaccineFounded) {
        return res.status(404).json({ message: "Vaccine not found." });
      }

      const recordsCount = await prisma.record.count({
        where: { vaccineId: vaccineFounded.idVaccine },
      });

      if (recordsCount > 0) {
        return res.status(400).json({ 
          message: `Cannot delete vaccine "${name}" because it has ${recordsCount} vaccination record(s) associated with it.` 
        });
      }

      const schemasCount = await prisma.vaccineSchema.count({
        where: { idVaccine: vaccineFounded.idVaccine },
      });

      if (schemasCount > 0) {
        return res.status(400).json({ 
          message: `Cannot delete vaccine "${name}" because it has ${schemasCount} vaccination schema(s) associated with it.` 
        });
      }

      await prisma.vaccine.delete({
        where: { idVaccine: vaccineFounded.idVaccine }
      });

      return res.status(200).json({ message: "Vaccine deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new VaccineController();
