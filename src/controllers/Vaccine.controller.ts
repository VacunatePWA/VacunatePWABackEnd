import { Request, Response } from "express";
import { AddVaccineDTO } from "../DTOs/AddVaccineDTO";
import prisma from "../db/prisma";

export class VaccineController {
  // Métodos: getAllVaccines, addVaccine, updateVaccine, deleteVaccine

  static async getAllVaccines(req: Request, res: Response): Promise<any> {
    try {
      const Vaccines = await prisma.vaccine.findMany({
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

      const vaccineFounded = await prisma.vaccine.findFirst({
        where: { name, active: true },
      });
      if (vaccineFounded) {
        return res
          .status(409)
          .json({ message: `Vaccine "${name}" already exists and is active.` });
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
      const vaccineFounded = await prisma.vaccine.findFirst({
        where: { name, active: true },
      });

      if (!vaccineFounded) {
        return res.status(404).json({ message: "Vaccine not found." });
      }

      await prisma.vaccine.update({
        where: { idVaccine: vaccineFounded.idVaccine },
        data: { name, description },
      });
      return res.status(200).json({ message: "Vaccine updated successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteVaccine(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body as AddVaccineDTO;

      const vaccineFound = await prisma.vaccine.findFirst({
        where: { name, active: true },
      });

      if (!vaccineFound) {
        return res.status(404).json({ message: "Vaccine not found." });
      }

      await prisma.vaccine.update({
        where: { idVaccine: vaccineFound.idVaccine },
        data: { active: false },
      });
      return res.status(200).json({ message: "Vaccine deleted (set inactive)." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new VaccineController();
