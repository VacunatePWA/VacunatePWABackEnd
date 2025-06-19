import { Request, Response } from "express";
import { AddRoleDTO } from "../DTOs/AddRoleDTO";
import prisma from "../db/prisma";

export class RoleController {
  static async getAllRoles(req: Request, res: Response): Promise<any> {
    try {
      const roles = await prisma.role.findMany({
        where: { active: true },
        include: {
          users: { select: { idUser: true, firstName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(roles);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addRole(req: Request, res: Response): Promise<any> {
    try {
      const { name, description } = req.body as AddRoleDTO;

      const roleFounded = await prisma.role.findFirst({
        where: { name, active: true },
      });
      if (roleFounded) {
        return res
          .status(409)
          .json({ message: `Role "${name}" already exists and is active.` });
      }

      const newRole = await prisma.role.create({
        data: { name, description },
      });

      return res.status(201).json(newRole);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateRole(req: Request, res: Response): Promise<any> {
    const { name, description } = req.body as AddRoleDTO;

    try {
      const roleFounded = await prisma.role.findFirst({
        where: { name, active: true },
      });

      if (!roleFounded) {
        return res.status(404).json({ message: "Role not found." });
      }

      await prisma.role.update({
        where: { idRole: roleFounded.idRole },
        data: { name, description },
      });
      return res.status(200).json({ message: "Role updated successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteRole(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body as AddRoleDTO;

      const roleFound = await prisma.role.findFirst({
        where: { name, active: true },
      });

      if (!roleFound) {
        return res.status(404).json({ message: "Role not found." });
      }

      await prisma.role.update({
        where: { idRole: roleFound.idRole },
        data: { active: false },
      });
      return res.status(200).json({ message: "Role deleted (set inactive)." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
  
  static async getRoleById(req: Request, res: Response): Promise<any> {
    try {
      const { roleId } = req.params;
      const role = await prisma.role.findUnique({ where: { idRole: roleId } });
      if (!role) {
        return res.status(404).json({ message: "Role not found." });
      }
      return res.status(200).json(role);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new RoleController();
