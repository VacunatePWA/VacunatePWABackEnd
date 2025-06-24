import { Request, Response } from 'express';
import prisma from '../db/prisma';

export class UserClinicController {
  static async assignClinicToUser(req: Request, res: Response): Promise<any> {
    try {
      const { userId, clinicId } = req.body;

      const user = await prisma.user.findUnique({
        where: { idUser: userId, active: true },
        include: { role: true }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      if (!['DOCTOR', 'ENFERMERO'].includes(user.role.name)) {
        return res.status(400).json({
          success: false,
          message: 'Solo se pueden asignar centros a doctores y enfermeros'
        });
      }

      const clinic = await prisma.clinic.findUnique({
        where: { idClinic: clinicId, active: true }
      });

      if (!clinic) {
        return res.status(404).json({
          success: false,
          message: 'Centro no encontrado'
        });
      }

      const existingAssignment = await prisma.userClinic.findFirst({
        where: {
          userId,
          clinicId,
          active: true
        }
      });

      if (existingAssignment) {
        return res.status(400).json({
          success: false,
          message: 'El usuario ya está asignado a este centro'
        });
      }

      const assignment = await prisma.userClinic.create({
        data: {
          userId,
          clinicId
        },
        include: {
          user: {
            select: {
              idUser: true,
              firstName: true,
              lastName: true,
              email: true,
              role: { select: { name: true } }
            }
          },
          clinic: {
            select: {
              idClinic: true,
              name: true,
              street: true,
              city: true,
              municipality: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Centro asignado exitosamente',
        data: assignment
      });
    } catch (error) {
      console.error('Error asignando centro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  static async removeClinicFromUser(req: Request, res: Response): Promise<any> {
    try {
      const { userId, clinicId } = req.body;

      const assignment = await prisma.userClinic.findFirst({
        where: {
          userId,
          clinicId,
          active: true
        }
      });

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Asignación no encontrada'
        });
      }

      await prisma.userClinic.update({
        where: { idUserClinic: assignment.idUserClinic },
        data: { active: false }
      });

      res.json({
        success: true,
        message: 'Asignación removida exitosamente'
      });
    } catch (error) {
      console.error('Error removiendo asignación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener centros asignados a un usuario
  static async getUserClinics(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;

      const assignments = await prisma.userClinic.findMany({
        where: {
          userId,
          active: true
        },
        include: {
          clinic: {
            select: {
              idClinic: true,
              name: true,
              street: true,
              city: true,
              municipality: true,
              phone: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: assignments.map((assignment: any) => assignment.clinic)
      });
    } catch (error) {
      console.error('Error obteniendo centros del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener usuarios asignados a un centro
  static async getClinicUsers(req: Request, res: Response): Promise<any> {
    try {
      const { clinicId } = req.params;

      const assignments = await prisma.userClinic.findMany({
        where: {
          clinicId,
          active: true
        },
        include: {
          user: {
            select: {
              idUser: true,
              firstName: true,
              lastName: true,
              email: true,
              role: { select: { name: true } }
            }
          }
        }
      });

      res.json({
        success: true,
        data: assignments.map((assignment: any) => assignment.user)
      });
    } catch (error) {
      console.error('Error obteniendo usuarios del centro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener todos los centros disponibles para asignar
  static async getAvailableClinics(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;

      // Obtener centros ya asignados al usuario
      const assignedClinics = await prisma.userClinic.findMany({
        where: {
          userId,
          active: true
        },
        select: { clinicId: true }
      });

      const assignedClinicIds = assignedClinics.map(ac => ac.clinicId);

      // Obtener centros no asignados
      const availableClinics = await prisma.clinic.findMany({
        where: {
          active: true,
          idClinic: {
            notIn: assignedClinicIds
          }
        },
        select: {
          idClinic: true,
          name: true,
          street: true,
          city: true,
          municipality: true,
          phone: true
        }
      });

      res.json({
        success: true,
        data: availableClinics
      });
    } catch (error) {
      console.error('Error obteniendo centros disponibles:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener usuarios supervisados por el usuario actual
  static async getSupervisedUsers(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;

      // Verificar que el usuario existe y es supervisor
      const supervisor = await prisma.user.findUnique({
        where: { idUser: userId, active: true },
        include: { role: true }
      });

      if (!supervisor) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Obtener usuarios supervisados
      const supervisedUsers = await prisma.user.findMany({
        where: {
          supervisorId: userId,
          active: true,
          role: {
            name: { in: ['DOCTOR', 'ENFERMERO'] }
          }
        },
        include: {
          role: {
            select: {
              name: true
            }
          },
          userClinics: {
            where: { active: true },
            include: {
              clinic: {
                select: {
                  idClinic: true,
                  name: true,
                  street: true,
                  city: true,
                  municipality: true
                }
              }
            }
          }
        },
        orderBy: {
          firstName: 'asc'
        }
      });

      // Formatear la respuesta
      const formattedUsers = supervisedUsers.map((user: any) => ({
        idUser: user.idUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        identification: user.identification,
        phone: user.phone,
        role: user.role,
        assignedClinics: user.userClinics.map((uc: any) => uc.clinic)
      }));

      res.json({
        success: true,
        data: formattedUsers
      });
    } catch (error) {
      console.error('Error obteniendo usuarios supervisados:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener supervisor del usuario actual
  static async getUserSupervisor(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;

      // Obtener usuario con su supervisor
      const user = await prisma.user.findUnique({
        where: { idUser: userId, active: true },
        include: {
          supervisor: {
            include: {
              role: {
                select: {
                  name: true
                }
              },
              userClinics: {
                where: { active: true },
                include: {
                  clinic: {
                    select: {
                      idClinic: true,
                      name: true,
                      street: true,
                      city: true,
                      municipality: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      if (!user.supervisor) {
        return res.json({
          success: true,
          data: null,
          message: 'El usuario no tiene supervisor asignado'
        });
      }

      // Formatear la respuesta del supervisor
      const supervisor = {
        idUser: user.supervisor.idUser,
        firstName: user.supervisor.firstName,
        lastName: user.supervisor.lastName,
        email: user.supervisor.email,
        identification: user.supervisor.identification,
        phone: user.supervisor.phone,
        role: user.supervisor.role,
        assignedClinics: user.supervisor.userClinics.map((uc: any) => uc.clinic)
      };

      res.json({
        success: true,
        data: supervisor
      });
    } catch (error) {
      console.error('Error obteniendo supervisor:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener colegas del mismo centro (doctores/enfermeros que trabajan en los mismos centros)
  static async getColleagues(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;

      // Obtener centros del usuario
      const userClinics = await prisma.userClinic.findMany({
        where: {
          userId,
          active: true
        },
        select: { clinicId: true }
      });

      if (userClinics.length === 0) {
        return res.json({
          success: true,
          data: [],
          message: 'El usuario no tiene centros asignados'
        });
      }

      const clinicIds = userClinics.map(uc => uc.clinicId);

      // Obtener otros usuarios que trabajan en los mismos centros
      const colleagues = await prisma.user.findMany({
        where: {
          active: true,
          idUser: { not: userId }, // Excluir al usuario actual
          role: {
            name: { in: ['DOCTOR', 'ENFERMERO'] }
          },
          userClinics: {
            some: {
              clinicId: { in: clinicIds },
              active: true
            }
          }
        },
        include: {
          role: {
            select: {
              name: true
            }
          },
          userClinics: {
            where: { 
              active: true,
            },
            include: {
              clinic: {
                select: {
                  idClinic: true,
                  name: true,
                  street: true,
                  city: true,
                  municipality: true
                }
              }
            }
          }
        },
        orderBy: {
          firstName: 'asc'
        }
      });

      // Formatear la respuesta
      const formattedColleagues = colleagues.map((user: any) => ({
        idUser: user.idUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        identification: user.identification,
        phone: user.phone,
        role: user.role,
        sharedClinics: user.userClinics.map((uc: any) => uc.clinic)
      }));

      res.json({
        success: true,
        data: formattedColleagues
      });
    } catch (error) {
      console.error('Error obteniendo colegas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}
