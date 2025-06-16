import { Request, Response } from "express";
import { AddClinicDTO } from "../DTOs/AddClinicDTO";
import prisma from "../db/prisma";

export class ClinicController {
  static async getAllclinics(req: Request, res: Response): Promise<any> {
    try {
      const clinics = await prisma.record.findMany({
        where: { active: true },

        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(clinics);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addclinic(req: Request, res: Response): Promise<any> {
    try {
      const { name, shortName, city, municipality, street, phone, director, website, email, latitude, longitude } = req.body as AddClinicDTO;

      const existing = await prisma.clinic.findUnique({ where: { name } });
      if (existing) {
        return res
          .status(409)
          .json({ message: `Clinic "${name}" already exists.` });
      }

      const newclinic = await prisma.clinic.create({
        data: { name, shortName, city, municipality, street, phone, director, website, email, latitude, longitude },
      });

      return res.status(201).json(newclinic);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateclinic(req: Request, res: Response): Promise<any> {
    const { name, shortName, city, municipality, street, phone, director, website, email, latitude, longitude } = req.body as AddClinicDTO;

    try {
      const existing = await prisma.clinic.findUnique({ where: { name } });

      if (!existing) {
        return res.status(404).json({ message: "Clinic not found." });
      }

      await prisma.clinic.update({
        where: { idClinic: existing.idClinic },
        data: { name, shortName, city, municipality, street, phone, director, website, email, latitude, longitude },
      });
      return res.status(200).json({ message: "Clinic updated successfully." });
    } catch (error) {
      console.error("Error updating clinic:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteclinic(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body as AddClinicDTO;

      const existing = await prisma.clinic.findUnique({ where: { name } });

      if (!existing) {
        return res.status(404).json({ message: "Clinic not found." });
      }

      await prisma.clinic.update({
        where: { idClinic: existing.idClinic },
        data: { active: false },
      });
      return res.status(200).json({ message: "Clinic deleted successfully." });
    } catch (error) {
      console.error("Error deleting clinic:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new ClinicController();
