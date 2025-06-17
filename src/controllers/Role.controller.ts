import { Request, Response } from "express";
import { AddRoleDTO } from "../DTOs/AddRoleDTO";
import prisma from "../db/prisma";

export class RoleController {
  static async getAllRoles(req: Request, res: Response): Promise<any> {
    try {
      const roles = await prisma.role.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(roles);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addRole(req: Request, res: Response): Promise<any> {
    try {
      const { name, description } = req.body as AddRoleDTO;

      const roleFounded = await prisma.role.findUnique({
        where: { name },
      });

      if (roleFounded) {
        return res.status(409).json({
          message: `Role "${name}" already exists.`,
        });
      }

      const newRole = await prisma.role.create({
        data: {
          name,
          description,
        },
      });

      return res.status(201).json(newRole);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateRole(req: Request, res: Response): Promise<any> {
    try {
      const { name, description } = req.body as AddRoleDTO;

      const roleFounded = await prisma.role.findUnique({
        where: { name },
      });

      if (!roleFounded) {
        return res.status(404).json({ message: "Role not found." });
      }

      const updatedRole = await prisma.role.update({
        where: { idRole: roleFounded.idRole },
        data: { name, description },
      });

      return res.status(200).json({
        message: "Role updated successfully.",
        updatedRole,
      });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteRole(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body as AddRoleDTO;

      const roleFounded = await prisma.role.findUnique({
        where: { name },
      });

      if (!roleFounded) {
        return res.status(404).json({ message: "Role not found." });
      }

      const activeUsersCount = await prisma.user.count({
        where: {
          roleId: roleFounded.idRole,
        },
      });

      if (activeUsersCount > 0) {
        return res.status(400).json({
          message: `Cannot delete role "${name}" because it has ${activeUsersCount} user(s) assigned to it.`,
        });
      }

      await prisma.role.delete({
        where: { idRole: roleFounded.idRole },
      });

      return res.status(200).json({ message: "Role deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new RoleController();
