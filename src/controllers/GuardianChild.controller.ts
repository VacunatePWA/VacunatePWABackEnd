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
        where: { 
          identification: identificationGuardian,
          active: true 
        },
      });

      const child = await prisma.child.findUnique({
        where: { 
          identification: identificationChild,
          active: true 
        },
      });

      if (!guardian) {
        return res.status(404).json({ message: "Guardian not found or inactive." });
      }

      if (!child) {
        return res.status(404).json({ message: "Child not found or inactive." });
      }

      const existingRelation = await prisma.guardianChild.findFirst({
        where: {
          guardianId: guardian.idGuardian,
          childId: child.idChild,
          active: true,
        },
      });

      if (existingRelation) {
        return res.status(409).json({ message: "Active relation already exists between this guardian and child." });
      }

      const relation = await prisma.guardianChild.create({
        data: {
          guardianId: guardian.idGuardian,
          childId: child.idChild,
          relationship,
          active: true,
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
        where: { 
          identification: identificationGuardian,
          active: true 
        },
      });

      const child = await prisma.child.findUnique({
        where: { 
          identification: identificationChild,
          active: true 
        },
      });

      if (!guardian) {
        return res.status(404).json({ message: "Guardian not found or inactive." });
      }

      if (!child) {
        return res.status(404).json({ message: "Child not found or inactive." });
      }

      const relation = await prisma.guardianChild.findFirst({
        where: {
          guardianId: guardian.idGuardian,
          childId: child.idChild,
          active: true,
        },
      });

      if (!relation) {
        return res.status(404).json({ message: "Active relation not found." });
      }

      const updatedRelation = await prisma.guardianChild.update({
        where: { idGuardianChild: relation.idGuardianChild },
        data: { relationship },
      });

      return res.status(200).json({ 
        message: "Relation updated successfully.", 
        updatedRelation 
      });
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
        where: { 
          identification: identificationGuardian,
          active: true 
        },
      });

      const child = await prisma.child.findUnique({
        where: { 
          identification: identificationChild,
          active: true 
        },
      });

      if (!guardian) {
        return res.status(404).json({ message: "Guardian not found or inactive." });
      }

      if (!child) {
        return res.status(404).json({ message: "Child not found or inactive." });
      }

      const relation = await prisma.guardianChild.findFirst({
        where: {
          guardianId: guardian.idGuardian,
          childId: child.idChild,
          active: true,
        },
      });

      if (!relation) {
        return res.status(404).json({ message: "Active relation not found." });
      }

      await prisma.guardianChild.update({
        where: { idGuardianChild: relation.idGuardianChild },
        data: { active: false },
      });

      return res.status(200).json({ message: "Relation deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new GuardianChildController();