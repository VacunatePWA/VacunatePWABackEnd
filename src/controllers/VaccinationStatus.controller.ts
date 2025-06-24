import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { differenceInMonths } from 'date-fns';

export class VaccinationStatusController {
  static async getVaccinationStatus(req: Request, res: Response): Promise<any> {
    try {
      const { idChild } = req.params;
      const child = await prisma.child.findUnique({ where: { idChild } });
      if (!child) return res.status(404).json({ error: 'Niño no encontrado' });

      const edadMeses = differenceInMonths(new Date(), child.birthDate);

      // Obtener esquema nacional
      const esquema = await prisma.vaccineSchema.findMany({
        where: { active: true },
        include: { vaccine: true },
        orderBy: { age: 'asc' },
      });

      const records = await prisma.record.findMany({
        where: { childId: idChild, active: true },
        include: { vaccine: true },
      });

      const aplicadas = records.map(r => ({
        nombre: r.vaccine.name,
        dosis: r.notes || `${r.dosesApplied} dosis`,
        fecha: r.dateApplied,
      }));

      const requeridas = esquema.filter(e => e.age <= edadMeses);

      const pendientes = requeridas.filter(req => {
        return !records.some(r => r.vaccineId === req.idVaccine && r.dosesApplied === req.Doses);
      }).map(req => ({
        nombre: req.vaccine.name,
        dosis: req.name,
        edadRecomendadaMeses: req.age,
      }));

      res.json({
        alDia: pendientes.length === 0,
        vacunasPendientes: pendientes,
        vacunasAplicadas: aplicadas,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al calcular el estado de vacunación' });
    }
  }
}
