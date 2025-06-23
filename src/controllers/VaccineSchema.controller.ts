import { Request, Response } from "express";
import { AddVaccineSchemaDTO } from "../DTOs/AddVaccineSchemaDTO";
import prisma from "../db/prisma";

export class VaccineSchemaController {
  // Métodos: getAllVaccineSchemas, addVaccineSchema, updateVaccineSchema, deleteVaccineSchema

  static async getAllVaccineSchemas(req: Request, res: Response): Promise<any> {
    try {
      const vaccineSchemas = await prisma.vaccineSchema.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
        include: { vaccine: true },
      });
      return res.status(200).json({
        message: "Vaccine schemas retrieved successfully",
        data: vaccineSchemas
      });
    } catch (error) {
      console.error('Error getting vaccine schemas:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addVaccineSchema(req: Request, res: Response): Promise<any> {
    try {
      const { name, doses, description, age, vaccineName } = req.body as AddVaccineSchemaDTO;
      
      const vaccine = await prisma.vaccine.findFirst({
        where: { name: vaccineName, active: true },
      });

      if (!vaccine) {
        // Buscar todas las vacunas activas para debug
        const allVaccines = await prisma.vaccine.findMany({
          where: { active: true },
          select: { idVaccine: true, name: true }
        });
        
        return res.status(404).json({ 
          message: "Vaccine not found.",
          searchedName: vaccineName,
          availableVaccines: allVaccines.map(v => v.name)
        });
      }

      const newVaccineSchema = await prisma.vaccineSchema.create({
        data: {
          name,
          Doses: doses,
          Description: description,
          age,
          idVaccine: vaccine.idVaccine,
        },
      });

      return res.status(201).json({
        message: "Vaccine schema created successfully",
        data: newVaccineSchema
      });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateVaccineSchema(req: Request, res: Response): Promise<any> {
    try {
      const { idVaccineSchema, name, doses, description, age, vaccineName } = req.body as AddVaccineSchemaDTO & { idVaccineSchema: string };

      // Si se proporciona idVaccineSchema, usarlo directamente
      if (idVaccineSchema) {
        const schema = await prisma.vaccineSchema.findUnique({
          where: { idVaccineSchema },
        });

        if (!schema) {
          return res.status(404).json({ message: "VaccineSchema not found." });
        }

        await prisma.vaccineSchema.update({
          where: { idVaccineSchema },
          data: {
            name,
            Doses: doses,
            age: age,
            Description: description,
          },
        });

        return res.status(200).json({ message: "VaccineSchema updated successfully." });
      }

      // Fallback: buscar por name y vaccineName (método anterior)
      const vaccine = await prisma.vaccine.findFirst({
        where: { name: vaccineName, active: true },
      });

      if (!vaccine) {
        return res.status(404).json({ message: "Vaccine not found." });
      }

      const schema = await prisma.vaccineSchema.findFirst({
        where: {
          name,
          idVaccine: vaccine.idVaccine,
        },
      });

      if (!schema) {
        return res.status(404).json({ message: "VaccineSchema not found." });
      }

      await prisma.vaccineSchema.update({
        where: { idVaccineSchema: schema.idVaccineSchema },
        data: {
          Doses: doses,
          age: age,
          Description: description,
        },
      });

      return res.status(200).json({ message: "VaccineSchema updated successfully." });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteVaccineSchema(req: Request, res: Response): Promise<any> {
    try {
      const { idVaccineSchema } = req.body;
      
      if (!idVaccineSchema) {
        return res.status(400).json({ message: "idVaccineSchema is required." });
      }
      
      const schema = await prisma.vaccineSchema.findUnique({ 
        where: { idVaccineSchema } 
      });
      
      if (!schema) {
        return res.status(404).json({ message: "VaccineSchema not found." });
      }
      
      if (schema.active === false) {
        return res.status(400).json({ message: "VaccineSchema is already inactive." });
      }
      
      await prisma.vaccineSchema.update({
        where: { idVaccineSchema },
        data: { active: false },
      });
      
      return res.status(200).json({ 
        message: "VaccineSchema deleted successfully.",
        data: { idVaccineSchema }
      });
    } catch (error) {
      console.error('Error deleting vaccine schema:', error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  }
}
