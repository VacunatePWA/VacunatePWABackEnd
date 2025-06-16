import { Request, Response } from "express";
import { AddChildDTO } from "../DTOs/AddChildDTO";
import prisma from "../db/prisma";

export class ChildController {
  static async getAllChilds(req: Request, res: Response): Promise<any> {
    try {
      const Childs = await prisma.record.findMany({
        where: { active: true },

        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(Childs);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addChild(req: Request, res: Response): Promise<any> {
    try {
      const { firstName, lastName, identificationType, identification, birthDate, gender, nationality, city, municipality } = req.body as AddChildDTO;

      const clinicFounded = await prisma.child.findUnique({ where: { identification } });
      if (clinicFounded) {
        return res
          .status(409)
          .json({ message: `Child "${identification}" already exists.` });
      }

      const newChild = await prisma.child.create({
        data: { firstName, lastName, identificationType, identification, birthDate, gender, nationality, city, municipality },
      });

      return res.status(201).json(newChild);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateChild(req: Request, res: Response): Promise<any> {
    const { firstName, lastName, identificationType, identification, birthDate, gender, nationality, city, municipality } = req.body as AddChildDTO;

    try {
      const clinicFounded = await prisma.child.findUnique({ where: { identification } });

      if (!clinicFounded) {
        return res.status(404).json({ message: "Child not found." });
      }

      await prisma.child.update({
        where: { idChild: clinicFounded.idChild },
        data: { firstName, lastName, gender, nationality, city, municipality },
      });
      return res.status(200).json({ message: "Child updated successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteChild(req: Request, res: Response): Promise<any> {
    try {
      const { identification } = req.body as AddChildDTO;

      const clinicFounded = await prisma.child.findUnique({ where: { identification } });

      if (!clinicFounded) {
        return res.status(404).json({ message: "Child not found." });
      }

      await prisma.child.update({
        where: { idChild: clinicFounded.idChild },
        data: { active: false },
      });
      return res.status(200).json({ message: "Child deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new ChildController();
