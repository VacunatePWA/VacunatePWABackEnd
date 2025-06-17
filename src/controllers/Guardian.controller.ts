import { Request, Response } from "express";
import { AddGuardianDTO } from "../DTOs/AddGuardianDTO";
import prisma from "../db/prisma";

export class GuardianController {
  static async getAllGuardians(req: Request, res: Response): Promise<any> {
    try {
      const guardians = await prisma.guardian.findMany({
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

      // Validar que no exista un guardian activo con la misma identificación
      const guardianFounded = await prisma.guardian.findUnique({ 
        where: { 
          identification,
          active: true 
        } 
      });
      
      if (guardianFounded) {
        return res
          .status(409)
          .json({ message: `Guardian "${identification}" already exists and is active.` });
      }

      // Crear el nuevo guardian con active: true
      const newGuardian = await prisma.guardian.create({
        data: { 
          firstName, 
          lastName, 
          identificationType, 
          identification, 
          email, 
          phone, 
          address,
          active: true 
        },
      });

      return res.status(201).json(newGuardian);
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
      // Buscar el guardian y validar que esté activo
      const guardianFounded = await prisma.guardian.findUnique({ 
        where: { 
          identification,
          active: true 
        } 
      });

      if (!guardianFounded) {
        return res.status(404).json({ message: "Guardian not found or inactive." });
      }

      // Actualizar el guardian
      const updatedGuardian = await prisma.guardian.update({
        where: { idGuardian: guardianFounded.idGuardian },
        data: { 
          firstName, 
          lastName, 
          email, 
          phone, 
          address 
        },
      });

      return res.status(200).json({ 
        message: "Guardian updated successfully.", 
        updatedGuardian 
      });
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

      // Buscar el guardian y validar que esté activo
      const guardianFounded = await prisma.guardian.findUnique({ 
        where: { 
          identification,
          active: true 
        } 
      });

      if (!guardianFounded) {
        return res.status(404).json({ message: "Guardian not found or inactive." });
      }

      // Borrado lógico
      await prisma.guardian.update({
        where: { idGuardian: guardianFounded.idGuardian },
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