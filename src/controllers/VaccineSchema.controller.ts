import { Request, Response } from "express";
import { AddVaccineSchemaDTO } from "../DTOs/AddVaccineSchemaDTO";
import prisma from "../db/prisma";

export class VaccineSchemaController {
  // Métodos: getAllVaccineSchemas, addVaccineSchema, updateVaccineSchema, deleteVaccineSchema

  static async getAllVaccineSchemas(req: Request, res: Response): Promise<any> {
    try {
      const vaccineSchemas = await prisma.vaccineSchema.findMany({
        orderBy: { createdAt: "desc" },
        include: { vaccine: true },
      });
      return res.status(200).json(vaccineSchemas);
    } catch (error) {
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
        return res.status(404).json({ message: "Vaccine not found." });
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

      return res.status(201).json(newVaccineSchema);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateVaccineSchema(req: Request, res: Response): Promise<any> {
    try {
      const { name, description, vaccineName } = req.body as AddVaccineSchemaDTO;

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
      
      const schema = await prisma.vaccineSchema.findFirst({ 
        where: { idVaccineSchema, active: true } 
      });
      
      if (!schema) {
        return res.status(404).json({ message: "VaccineSchema not found." });
      }
      
      await prisma.vaccineSchema.update({
        where: { idVaccineSchema: schema.idVaccineSchema },
        data: { active: false },
      });
      
      return res.status(200).json({ message: "VaccineSchema deleted (set inactive)." });
    } catch (error) {
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  }
}
