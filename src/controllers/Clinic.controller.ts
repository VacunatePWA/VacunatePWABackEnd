import { Request, Response } from "express";
import { AddClinicDTO } from "../DTOs/AddClinicDTO";
import prisma from "../db/prisma";

export class ClinicController {
  static async getAllClinics(req: Request, res: Response): Promise<any> {
    try {
      const clinics = await prisma.clinic.findMany({
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

  static async addClinic(req: Request, res: Response): Promise<any> {
    try {
      const { name, shortName, city, municipality, street, phone, director, website, email, latitude, longitude } = req.body as AddClinicDTO;

      const clinicFounded = await prisma.clinic.findUnique({ where: { name } });
      if (clinicFounded) {
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

  static async updateClinic(req: Request, res: Response): Promise<any> {
    const { name, shortName, city, municipality, street, phone, director, website, email, latitude, longitude } = req.body as AddClinicDTO;

    try {
      const clinicFounded = await prisma.clinic.findUnique({ where: { name } });

      if (!clinicFounded) {
        return res.status(404).json({ message: "Clinic not found." });
      }

      await prisma.clinic.update({
        where: { idClinic: clinicFounded.idClinic },
        data: { name, shortName, city, municipality, street, phone, director, website, email, latitude, longitude },
      });
      return res.status(200).json({ message: "Clinic updated successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteClinic(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body as AddClinicDTO;

      const clinicFound = await prisma.clinic.findUnique({ where: { name } });

      if (!clinicFound) {
        return res.status(404).json({ message: "Clinic not found." });
      }

      await prisma.clinic.delete({
        where: { idClinic: clinicFound.idClinic },
      });
      return res.status(200).json({ message: "Clinic deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async getClinicCount(req: Request, res: Response): Promise<any> {
    try {
      const count = await prisma.clinic.count({
        where: { active: true }
      });
      return res.status(200).json({ count });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new ClinicController();
