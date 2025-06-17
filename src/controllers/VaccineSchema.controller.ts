import { Request, Response } from "express";
import { AddVaccineSchemaDTO } from "../DTOs/AddVaccineSchemaDTO";
import prisma from "../db/prisma";

export class VaccineSchemaController {
  static async getAllVaccineSchemas(req: Request, res: Response): Promise<any> {
    try {
      const vaccineSchemas = await prisma.vaccineSchema.findMany({
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
        where: { name: vaccineName },
      });

      if (!vaccine) {
        return res.status(404).json({ message: "Vaccine not found." });
      }

      const vaccineSchemaFounded = await prisma.vaccineSchema.findFirst({
        where: {
          name,
          idVaccine: vaccine.idVaccine,
        },
      });

      if (vaccineSchemaFounded) {
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
        where: { name: vaccineName },
      });

      if (!vaccine) {
        return res.status(404).json({ message: "Vaccine not found." });
      }

      const vaccineSchemaFounded = await prisma.vaccineSchema.findFirst({
        where: {
          name,
          idVaccine: vaccine.idVaccine,
        },
      });

      if (!vaccineSchemaFounded) {
        return res.status(404).json({ message: "Vaccine schema not found." });
      }

      const updatedSchema = await prisma.vaccineSchema.update({
        where: { idVaccineSchema: vaccineSchemaFounded.idVaccineSchema },
        data: {
          Description: description,
        },
      });

      return res.status(200).json({ 
        message: "Vaccine schema updated successfully.", 
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
        where: { name: vaccineName },
      });

      if (!vaccine) {
        return res.status(404).json({ message: "Vaccine not found." });
      }

      const vaccineSchemaFounded = await prisma.vaccineSchema.findFirst({
        where: {
          name,
          idVaccine: vaccine.idVaccine,
        },
      });

      if (!vaccineSchemaFounded) {
        return res.status(404).json({ message: "Vaccine schema not found." });
      }

      await prisma.vaccineSchema.delete({
        where: { idVaccineSchema: vaccineSchemaFounded.idVaccineSchema },
      });

      return res.status(200).json({ message: "Vaccine schema deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new VaccineSchemaController();
