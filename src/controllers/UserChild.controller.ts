import { Request, Response } from "express";
import { AddUserChildDTO } from "../DTOs/AddUserChildDTO";
import prisma from "../db/prisma";

export class UserChildController {
  static async getAllRelations(req: Request, res: Response): Promise<any> {
    try {
      const relations = await prisma.guardianChild.findMany({
        where: { active: true },
        include: {
          child: true,
          guardian: true,
        },
      });

      // Transformar las relaciones al formato esperado por el frontend
      const formattedRelations = relations.map(relation => ({
        identificationUser: relation.guardian.identification,
        identificationChild: relation.child.identification,
        relationship: relation.relationship,
        guardianName: `${relation.guardian.firstName} ${relation.guardian.lastName}`,
        childName: `${relation.child.firstName} ${relation.child.lastName}`,
        assignedAt: relation.assignedAt
      }));

      return res.status(200).json({
        message: "Relaciones obtenidas exitosamente",
        data: formattedRelations
      });
    } catch (error) {
      return res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
    }
  }

  static async addRelation(req: Request, res: Response): Promise<any> {
    try {
      const { identificationUser, identificationChild, relationship } = req.body as AddUserChildDTO;
      const user = await prisma.user.findFirst({ where: { identification: identificationUser, active: true } });
      const child = await prisma.child.findFirst({ where: { identification: identificationChild, active: true } });
      if (!user || !child) {
        return res.status(404).json({ message: "User or child not found." });
      }
      const exists = await prisma.guardianChild.findFirst({
        where: { guardianId: user.idUser, childId: child.idChild, active: true },
      });
      if (exists) {
        return res.status(409).json({ message: "Relation already exists and is active." });
      }
      const relation = await prisma.guardianChild.create({
        data: {
          guardianId: user.idUser,
          childId: child.idChild,
          relationship,
        },
      });
      return res.status(201).json(relation);
    } catch (error) {
      return res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
    }
  }

  static async putRelationInactive(req: Request, res: Response): Promise<any> {
    try {
      const { identificationUser, identificationChild } = req.body as AddUserChildDTO;
      const user = await prisma.user.findFirst({ where: { identification: identificationUser, active: true } });
      const child = await prisma.child.findFirst({ where: { identification: identificationChild, active: true } });
      if (!user || !child) {
        return res.status(404).json({ message: "User or child not found." });
      }
      const relation = await prisma.guardianChild.findFirst({
        where: { guardianId: user.idUser, childId: child.idChild, active: true },
      });
      if (!relation) {
        return res.status(404).json({ message: "Relation not found." });
      }
      await prisma.guardianChild.update({
        where: { idGuardianChild: relation.idGuardianChild },
        data: { active: false },
      });
      return res.status(200).json({ message: "Relation deleted (set inactive)." });
    } catch (error) {
      return res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
    }
  }
}
