import { Request, Response } from "express";
import { AddGuardianDTO } from "../DTOs/AddGuardianDTO";
import prisma from "../db/prisma";

export class GuardianController {
  static async getAllGuardians(req: Request, res: Response): Promise<any> {
    try {
      const guardians = await prisma.clinic.findMany({
        where: { active: true },

        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(guardians);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addGuardian(req: Request, res: Response): Promise<any> {
    try {
      const { firstName, lastName, identificationType, identification, email, phone, address } = req.body as AddGuardianDTO;

      const clinicFounded = await prisma.guardian.findUnique({ where: { identification } });
      if (clinicFounded) {
        return res
          .status(409)
          .json({ message: `Guardian "${identification}" already exists.` });
      }

      const newguardian = await prisma.guardian.create({
        data: { firstName, lastName, identificationType, identification, email, phone, address },
      });

      return res.status(201).json(newguardian);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateGuardian(req: Request, res: Response): Promise<any> {
    const { firstName, lastName, identification, email, phone, address } = req.body as AddGuardianDTO;

    try {
      const clinicFounded = await prisma.guardian.findUnique({ where: { identification } });

      if (!clinicFounded) {
        return res.status(404).json({ message: "Guardian not found." });
      }

      await prisma.guardian.update({
        where: { idGuardian: clinicFounded.idGuardian },
        data: { firstName, lastName, email, phone, address },
      });
      return res.status(200).json({ message: "Guardian updated successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteGuardian(req: Request, res: Response): Promise<any> {
    try {
      const { identification } = req.body as AddGuardianDTO;

      const clinicFounded = await prisma.guardian.findUnique({ where: { identification } });

      if (!clinicFounded) {
        return res.status(404).json({ message: "Guardian not found." });
      }

      await prisma.guardian.update({
        where: { idGuardian: clinicFounded.idGuardian },
        data: { active: false },
      });
      return res.status(200).json({ message: "Guardian deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new GuardianController();
