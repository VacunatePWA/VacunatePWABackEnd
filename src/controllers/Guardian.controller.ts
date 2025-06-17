import { Request, Response } from "express";
import { AddGuardianDTO } from "../DTOs/AddGuardianDTO";
import prisma from "../db/prisma";

export class GuardianController {
  static async getAllGuardians(req: Request, res: Response): Promise<any> {
    try {
      const guardians = await prisma.guardian.findMany({
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
      const {
        firstName,
        lastName,
        identificationType,
        identification,
        email,
        phone,
        city,
        municipality,
      } = req.body as AddGuardianDTO;

      const guardianFounded = await prisma.guardian.findUnique({
        where: { identification },
      });

      if (guardianFounded) {
        return res
          .status(409)
          .json({ message: `Guardian "${identification}" already exists.` });
      }

      const newGuardian = await prisma.guardian.create({
        data: {
          firstName,
          lastName,
          identificationType,
          identification,
          email,
          phone,
          city,
          municipality,
        },
      });

      return res.status(201).json(newGuardian);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateGuardian(req: Request, res: Response): Promise<any> {
    try {
      const {
        firstName,
        lastName,
        identification,
        email,
        phone,
        city,
        municipality,
      } = req.body as AddGuardianDTO;

      const guardianFounded = await prisma.guardian.findUnique({
        where: { identification },
      });

      if (!guardianFounded) {
        return res.status(404).json({ message: "Guardian not found." });
      }

      const updatedGuardian = await prisma.guardian.update({
        where: { idGuardian: guardianFounded.idGuardian },
        data: {
          firstName,
          lastName,
          email,
          phone,
          city,
          municipality,
        },
      });

      return res.status(200).json({
        message: "Guardian updated successfully.",
        updatedGuardian,
      });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteGuardian(req: Request, res: Response): Promise<any> {
    try {
      const { identification } = req.body as { identification: string };

      const guardianFounded = await prisma.guardian.findUnique({
        where: { identification },
      });

      if (!guardianFounded) {
        return res.status(404).json({ message: "Guardian not found." });
      }

      await prisma.guardian.delete({
        where: { idGuardian: guardianFounded.idGuardian },
      });

      return res
        .status(200)
        .json({ message: "Guardian deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new GuardianController();
