import { Request, Response } from "express";
import prisma from "../db/prisma";
import { AddGuardianChildDTO } from "../DTOs/AddGuardianChildDTO";

export class GuardianChildController {
  static async getAllRelations(req: Request, res: Response): Promise<any> {
    try {
      const guardianChild = await prisma.guardianChild.findMany({
        orderBy: { assignedAt: "desc" },
        where: { active: true },
      });
      return res.status(200).json(guardianChild);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addRelation(req: Request, res: Response): Promise<any> {
    try {
      const { identificationGuardian, identificationChild, relationship } = req.body as AddGuardianChildDTO;

      const guardian = await prisma.guardian.findUnique({
        where: { identification: identificationGuardian },
      });

      const child = await prisma.child.findUnique({
        where: { identification: identificationChild },
      });

      if (!guardian || !child) {
        return res.status(404).json({ message: "Guardian or child not found." });
      }

      const relation = await prisma.guardianChild.create({
        data: {
          guardianId: guardian.idGuardian,
          childId: child.idChild,
          relationship,
        },
      });

      return res.status(201).json(relation);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }


  static async updateRelation(req: Request, res: Response): Promise<any> {
  try {
    const { identificationGuardian, identificationChild, relationship } = req.body as AddGuardianChildDTO;

    const guardian = await prisma.guardian.findUnique({
      where: { identification: identificationGuardian },
    });

    const child = await prisma.child.findUnique({
      where: { identification: identificationChild },
    });

    if (!guardian || !child) {
      return res.status(404).json({ message: "Guardian or child not found." });
    }

    const relation = await prisma.guardianChild.findUnique({
      where: {
        guardianId_childId: {
          guardianId: guardian.idGuardian,
          childId: child.idChild,
        },
      },
    });

    if (!relation) {
      return res.status(404).json({ message: "Relation not found." });
    }

    await prisma.guardianChild.update({
      where: { idGuardianChild: relation.idGuardianChild },
      data: { relationship },
    });

    return res.status(200).json({ message: "Relation updated successfully." });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

    static async deleteRelation(req: Request, res: Response): Promise<any> {
    try {
      const { identificationGuardian, identificationChild } = req.body as AddGuardianChildDTO;

      const guardian = await prisma.guardian.findUnique({
        where: { identification: identificationGuardian },
      });

      const child = await prisma.child.findUnique({
        where: { identification: identificationChild },
      });

      if (!guardian || !child) {
        return res.status(404).json({ message: "Guardian or child not found." });
      }

      const relation = await prisma.guardianChild.findUnique({
        where: {
          guardianId_childId: {
            guardianId: guardian.idGuardian,
            childId: child.idChild,
          },
        },
      });

      if (!relation) {
        return res.status(404).json({ message: "Relation not found." });
      }

      await prisma.guardianChild.delete({
        where: { idGuardianChild: relation.idGuardianChild },
      });

      return res.status(200).json({ message: "Relation deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
    
}
