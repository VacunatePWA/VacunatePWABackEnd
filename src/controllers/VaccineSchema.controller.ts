import { Request, Response } from "express";
import { AddVaccineSchemaDTO } from "../DTOs/AddVaccineSchemaDTO";
import prisma from "../db/prisma";

export class VaccineSchemaController {
  static async getAllVaccineSchemas(req: Request, res: Response): Promise<any> {
    try {
      const vaccineSchemas = await prisma.vaccineSchema.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
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

      const vaccine = await prisma.vaccine.findUnique({
        where: { 
          name: vaccineName,
          active: true 
        },
      });

      if (!vaccine) {
        return res.status(404).json({ message: "Vaccine not found or inactive." });
      }

      const existingSchema = await prisma.vaccineSchema.findFirst({
        where: {
          name,
          idVaccine: vaccine.idVaccine,
          active: true,
        },
      });

      if (existingSchema) {
        return res.status(409).json({ 
          message: `Vaccine schema "${name}" already exists for vaccine "${vaccineName}".` 
        });
      }

      const newVaccineSchema = await prisma.vaccineSchema.create({
        data: {
          name,
          Doses: doses,
          Description: description,
          age,
          idVaccine: vaccine.idVaccine,
          active: true,
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

      const vaccine = await prisma.vaccine.findUnique({
        where: { 
          name: vaccineName,
          active: true 
        },
      });

      if (!vaccine) {
        return res.status(404).json({ message: "Vaccine not found or inactive." });
      }

      const schema = await prisma.vaccineSchema.findFirst({
        where: {
          name,
          idVaccine: vaccine.idVaccine,
          active: true,
        },
      });

      if (!schema) {
        return res.status(404).json({ message: "VaccineSchema not found or inactive." });
      }

      const updatedSchema = await prisma.vaccineSchema.update({
        where: { idVaccineSchema: schema.idVaccineSchema },
        data: {
          Description: description,
        },
      });

      return res.status(200).json({ 
        message: "VaccineSchema updated successfully.", 
        updatedSchema 
      });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteVaccineSchema(req: Request, res: Response): Promise<any> {
    try {
      const { name, vaccineName } = req.body as {
        name: string;
        vaccineName: string;
      };

      const vaccine = await prisma.vaccine.findUnique({
        where: { 
          name: vaccineName,
          active: true 
        },
      });

      if (!vaccine) {
        return res.status(404).json({ message: "Vaccine not found or inactive." });
      }

      const schema = await prisma.vaccineSchema.findFirst({
        where: {
          name,
          idVaccine: vaccine.idVaccine,
          active: true,
        },
      });

      if (!schema) {
        return res.status(404).json({ message: "VaccineSchema not found or inactive." });
      }

      // Borrado lógico
      await prisma.vaccineSchema.update({
        where: { idVaccineSchema: schema.idVaccineSchema },
        data: { active: false }
      });

      return res.status(200).json({ message: "VaccineSchema deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new VaccineSchemaController();