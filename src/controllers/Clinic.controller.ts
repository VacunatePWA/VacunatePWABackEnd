import { Request, Response } from "express";
import { AddClinicDTO } from "../DTOs/AddClinicDTO";
import prisma from "../db/prisma";

export class ClinicController {
  static async getAllClinics(req: Request, res: Response): Promise<any> {
    try {
      const clinics = await prisma.clinic.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(clinics);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addClinic(req: Request, res: Response): Promise<any> {
    try {
      const {
        name,
        shortName,
        city,
        municipality,
        street,
        phone,
        director,
        website,
        email,
        latitude,
        longitude,
      } = req.body as AddClinicDTO;

      const clinicExists = await prisma.clinic.findUnique({
        where: { name },
      });

      if (clinicExists) {
        return res
          .status(409)
          .json({ message: `Clinic "${name}" already exists.` });
      }

      const newClinic = await prisma.clinic.create({
        data: {
          name,
          shortName,
          city,
          municipality,
          street,
          phone,
          director,
          website,
          email,
          latitude,
          longitude,
        },
      });

      return res.status(201).json(newClinic);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateClinic(req: Request, res: Response): Promise<any> {
    const {
      name,
      shortName,
      city,
      municipality,
      street,
      phone,
      director,
      website,
      email,
      latitude,
      longitude,
    } = req.body as AddClinicDTO;

    try {
      const clinic = await prisma.clinic.findUnique({
        where: { name },
      });

      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found." });
      }

      const updatedClinic = await prisma.clinic.update({
        where: { idClinic: clinic.idClinic },
        data: {
          name,
          shortName,
          city,
          municipality,
          street,
          phone,
          director,
          website,
          email,
          latitude,
          longitude,
        },
      });

      return res.status(200).json({
        message: "Clinic updated successfully.",
        updatedClinic,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteClinic(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body as AddClinicDTO;

      const clinic = await prisma.clinic.findUnique({
        where: { name },
      });

      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found." });
      }

      await prisma.clinic.delete({
        where: { idClinic: clinic.idClinic },
      });

      return res.status(200).json({ message: "Clinic deleted successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new ClinicController();
