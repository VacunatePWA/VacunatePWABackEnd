import { Request, Response } from "express";
import prisma from "../db/prisma";

export class GuardianController {
  static async getAvailableTutors(req: Request, res: Response): Promise<any> {
    try {
      // Obtener usuarios con rol de tutor
      const tutorRole = await prisma.role.findFirst({
        where: { name: "Tutor" }
      });

      if (!tutorRole) {
        return res.status(404).json({
          message: "Rol de tutor no encontrado"
        });
      }

      const tutors = await prisma.user.findMany({
        where: {
          active: true,
          roleId: tutorRole.idRole
        },
        select: {
          idUser: true,
          firstName: true,
          lastName: true,
          identification: true,
          email: true,
          phone: true
        },
        orderBy: [
          { firstName: 'asc' },
          { lastName: 'asc' }
        ]
      });

      return res.status(200).json({
        message: "Tutores disponibles obtenidos exitosamente",
        data: tutors
      });
    } catch (error) {
      console.error('Error getting available tutors:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async getAllGuardians(req: Request, res: Response): Promise<any> {
    try {
      // Obtener roles de tutor y guardian
      const tutorGuardianRoles = await prisma.role.findMany({
        where: {
          name: { in: ["TUTOR", "GUARDIAN"] }
        }
      });

      const roleIds = tutorGuardianRoles.map(role => role.idRole);

      const guardians = await prisma.user.findMany({
        where: {
          active: true,
          roleId: { in: roleIds }
        },
        include: {
          role: true,
          guardianChildren: {
            where: { active: true },
            include: {
              child: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      return res.status(200).json({
        message: "Tutores obtenidos exitosamente",
        data: guardians
      });
    } catch (error) {
      console.error('Error getting guardians:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new GuardianController();