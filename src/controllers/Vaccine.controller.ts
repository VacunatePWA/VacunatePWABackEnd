import { Request, Response } from "express";
import { AddVaccineDTO } from "../DTOs/AddVaccineDTO";
import prisma from "../db/prisma";

export class VaccineController {
  static async getAllVaccines(req: Request, res: Response): Promise<any> {
    try {
      const Vaccines = await prisma.record.findMany({
        where: { active: true },

        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(Vaccines);
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

      const existing = await prisma.vaccine.findUnique({ where: { name } });
      if (existing) {
        return res
          .status(409)
          .json({ message: `Vaccine "${name}" already exists.` });
      }

      const newVaccine = await prisma.vaccine.create({
        data: { name, brand, description },
      });

      return res.status(201).json(newVaccine);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateVaccine(req: Request, res: Response): Promise<any> {
    const { name, description } = req.body as AddVaccineDTO;

    try {
      const existing = await prisma.vaccine.findUnique({ where: { name } });

      if (!existing) {
        return res.status(404).json({ message: "Vaccine not found." });
      }

      await prisma.vaccine.update({
        where: { idVaccine: existing.idVaccine },
        data: { name, description },
      });
      return res.status(200).json({ message: "Vaccine updated successfully." });
    } catch (error) {
      console.error("Error updating vaccine:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteVaccine(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body as AddVaccineDTO;

      const existing = await prisma.vaccine.findUnique({ where: { name } });

      if (!existing) {
        return res.status(404).json({ message: "vaccine not found." });
      }

      await prisma.vaccine.update({
        where: { idVaccine: existing.idVaccine },
        data: { active: false },
      });
      return res.status(200).json({ message: "vaccine deleted successfully." });
    } catch (error) {
      console.error("Error deleting vaccine:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new VaccineController();
