import { Request, Response } from "express";
import { AddChildDTO } from "../DTOs/AddChildDTO";
import prisma from "../db/prisma";

export class ChildController {
  static async getAllChilds(req: Request, res: Response): Promise<any> {
    try {
      const Childs = await prisma.child.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({
        message: "Children retrieved successfully",
        data: Childs
      });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async addChild(req: Request, res: Response): Promise<any> {
    try {
      const { firstName, lastName, identificationType, identification, birthDate, gender, nationality, city, municipality } = req.body as AddChildDTO;

      const childFounded = await prisma.child.findFirst({ where: { identification, active: true } });
      if (childFounded) {
        return res
          .status(409)
          .json({ message: `Child "${identification}" already exists and is active.` });
      }

      const newChild = await prisma.child.create({
        data: { firstName, lastName, identificationType, identification, birthDate, gender, nationality, city, municipality },
      });

      return res.status(201).json(newChild);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateChild(req: Request, res: Response): Promise<any> {
    const { firstName, lastName, identificationType, identification, birthDate, gender, nationality, city, municipality } = req.body as AddChildDTO;

    try {
      const childFounded = await prisma.child.findFirst({ where: { identification, active: true } });

      if (!childFounded) {
        return res.status(404).json({ message: "Child not found." });
      }

      await prisma.child.update({
        where: { idChild: childFounded.idChild },
        data: { firstName, lastName, gender, nationality, city, municipality },
      });
      return res.status(200).json({ message: "Child updated successfully." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async deleteChild(req: Request, res: Response): Promise<any> {
    try {
      const { identification } = req.body as AddChildDTO;

      const childFound = await prisma.child.findFirst({ where: { identification, active: true } });

      if (!childFound) {
        return res.status(404).json({ message: "Child not found." });
      }

      await prisma.child.update({
        where: { idChild: childFound.idChild },
        data: { active: false },
      });
      return res.status(200).json({ message: "Child deleted (set inactive)." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async getChildCount(req: Request, res: Response): Promise<any> {
    try {
      const count = await prisma.child.count({
        where: { active: true }
      });
      return res.status(200).json({ count });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Método para obtener tutores disponibles
  static async getAvailableTutors(req: Request, res: Response): Promise<any> {
    try {
      // Buscar usuarios con rol de tutor
      const tutorRole = await prisma.role.findFirst({
        where: { name: 'tutor', active: true }
      });

      if (!tutorRole) {
        return res.status(404).json({ message: "Rol de tutor no encontrado" });
      }

      const tutors = await prisma.user.findMany({
        where: {
          roleId: tutorRole.idRole,
          active: true
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

      return res.status(200).json({ data: tutors });
    } catch (error) {
      console.error('Error getting available tutors:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async getTutorChildren(req: Request, res: Response): Promise<any> {
    try {
      const userIdentification = (req as any).user?.identification;
      
      if (!userIdentification) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      // Primero encontrar el usuario por su identificación
      const user = await prisma.user.findFirst({
        where: { identification: userIdentification, active: true }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Buscar las relaciones tutor-hijo
      const guardianChildRelations = await prisma.guardianChild.findMany({
        where: {
          guardianId: user.idUser,
          active: true
        },
        include: {
          child: true
        }
      });

      const children = guardianChildRelations
        .filter(relation => relation.child && relation.child.active)
        .map(relation => relation.child);

      return res.status(200).json({ data: children });
    } catch (error) {
      console.error('Error getting tutor children:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async getChildVaccinationStatus(req: Request, res: Response): Promise<any> {
    try {
      const { childId } = req.params;
      const userIdentification = (req as any).user?.identification;
      
      if (!userIdentification) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      // Primero encontrar el usuario por su identificación
      const user = await prisma.user.findFirst({
        where: { identification: userIdentification, active: true }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Verificar que el usuario es tutor del niño
      const child = await prisma.child.findUnique({
        where: { idChild: childId }
      });

      if (!child) {
        return res.status(404).json({ message: "Niño no encontrado" });
      }

      const relation = await prisma.guardianChild.findFirst({
        where: {
          guardianId: user.idUser,
          childId: childId,
          active: true
        }
      });

      if (!relation) {
        return res.status(403).json({ message: "No tiene permisos para ver la información de este niño" });
      }

      // Obtener los registros de vacunación del niño
      const vaccinationRecords = await prisma.record.findMany({
        where: {
          childId: childId,
          active: true
        },
        include: {
          vaccine: true
        },
        orderBy: { createdAt: 'desc' }
      });

      // Calcular la edad en meses
      const birthDate = new Date(child.birthDate);
      const now = new Date();
      const ageInMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + 
                         (now.getMonth() - birthDate.getMonth());

      // Obtener las vacunas que debería tener según su edad
      const requiredVaccines = await prisma.vaccineSchema.findMany({
        where: {
          age: { lte: ageInMonths },
          active: true
        },
        include: {
          vaccine: true
        }
      });

      // Determinar qué vacunas faltan
      const appliedVaccineIds = vaccinationRecords.map(record => record.vaccineId);
      const pendingVaccines = requiredVaccines.filter(schema => 
        !appliedVaccineIds.includes(schema.idVaccine)
      );

      const isUpToDate = pendingVaccines.length === 0;
      const completionPercentage = requiredVaccines.length > 0 
        ? Math.round(((requiredVaccines.length - pendingVaccines.length) / requiredVaccines.length) * 100)
        : 100;

      return res.status(200).json({
        data: {
          isUpToDate,
          completionPercentage,
          appliedVaccines: vaccinationRecords.length,
          pendingVaccines: pendingVaccines.length,
          totalRequiredVaccines: requiredVaccines.length,
          nextVaccine: pendingVaccines.length > 0 ? pendingVaccines[0] : null
        }
      });
    } catch (error) {
      console.error('Error getting vaccination status:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Placeholder para generar carnet de vacunación
  static async generateVaccinationCard(req: Request, res: Response): Promise<any> {
    try {
      const { childId } = req.params;
      const userIdentification = (req as any).user?.identification;
      
      if (!userIdentification) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      // Primero encontrar el usuario por su identificación
      const user = await prisma.user.findFirst({
        where: { identification: userIdentification, active: true }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Verificar que el usuario es tutor del niño
      const relation = await prisma.guardianChild.findFirst({
        where: {
          guardianId: user.idUser,
          childId: childId,
          active: true
        }
      });

      if (!relation) {
        return res.status(403).json({ message: "No tiene permisos para generar el carnet de este niño" });
      }

      // Obtener información completa del niño
      const child = await prisma.child.findUnique({
        where: { idChild: childId }
      });

      // Obtener registros de vacunación
      const vaccinationRecords = await prisma.record.findMany({
        where: {
          childId: childId,
          active: true
        },
        include: {
          vaccine: true,
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { dateApplied: 'asc' }
      });

      return res.status(200).json({ 
        message: "Datos del carnet obtenidos exitosamente",
        data: {
          child,
          vaccinationRecords
        }
      });
    } catch (error) {
      console.error('Error generating vaccination card:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async getMyChildren(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.idUser;
      if (!userId) return res.status(401).json({ message: 'No autenticado' });

      // Obtener hijos del tutor a través de la tabla de relaciones
      const children = await prisma.child.findMany({
        where: {
          active: true,
          guardianChildren: {
            some: {
              guardianId: userId,
              active: true
            }
          }
        },
        include: {
          guardianChildren: {
            where: { 
              guardianId: userId,
              active: true 
            },
            include: {
              guardian: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      return res.status(200).json({
        message: "Hijos obtenidos exitosamente",
        data: children
      });
    } catch (error) {
      console.error('Error getting my children:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async getVaccinationStatus(req: Request, res: Response): Promise<any> {
    try {
      const { childId } = req.params;
      const userId = req.body.user?.idUser;
      
      if (!userId) {
        return res.status(401).json({ message: "Usuario no autorizado" });
      }

      // Verificar que el niño pertenece al tutor
      const child = await prisma.child.findFirst({
        where: {
          idChild: childId,
          active: true,
          guardianChildren: {
            some: {
              guardianId: userId,
              active: true
            }
          }
        }
      });

      if (!child) {
        return res.status(404).json({ message: "Niño no encontrado o no autorizado" });
      }

      // Calcular edad en meses
      const now = new Date();
      const birthDate = new Date(child.birthDate);
      const ageInMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + 
                         (now.getMonth() - birthDate.getMonth());

      // Obtener esquemas de vacunación aplicables
      const applicableSchemas = await prisma.vaccineSchema.findMany({
        where: {
          age: { lte: ageInMonths },
          active: true
        },
        include: {
          vaccine: true
        }
      });

      // Obtener vacunas aplicadas
      const appliedVaccines = await prisma.record.findMany({
        where: {
          childId: childId,
          active: true
        },
        include: {
          vaccine: true
        }
      });

      // Determinar estado de vacunación
      let isUpToDate = true;
      const missingVaccines = [];

      for (const schema of applicableSchemas) {
        const appliedVaccine = appliedVaccines.find(av => 
          av.vaccine.name === schema.vaccine.name
        );
        
        if (!appliedVaccine || appliedVaccine.dosesApplied < schema.Doses) {
          isUpToDate = false;
          missingVaccines.push({
            vaccineName: schema.vaccine.name,
            requiredDose: schema.Doses,
            appliedDoses: appliedVaccine?.dosesApplied || 0,
            ageRecommended: schema.age
          });
        }
      }

      return res.status(200).json({
        message: "Estado de vacunación obtenido exitosamente",
        data: {
          isUpToDate,
          ageInMonths,
          totalApplicableVaccines: applicableSchemas.length,
          appliedVaccines: appliedVaccines.length,
          missingVaccines
        }
      });
    } catch (error) {
      console.error('Error getting vaccination status:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async createChildWithTutor(req: Request, res: Response): Promise<any> {
    try {
      const { child, users, relations, tutorId, vaccineRecords } = req.body;

      // Verificar si el niño ya existe
      const existingChild = await prisma.child.findFirst({
        where: { 
          identification: child.identification, 
          active: true 
        }
      });

      if (existingChild) {
        return res.status(409).json({ 
          message: `El niño con cédula "${child.identification}" ya existe.` 
        });
      }

      return await prisma.$transaction(async (tx) => {
        // Crear el niño
        const newChild = await tx.child.create({
          data: {
            ...child,
            birthDate: new Date(child.birthDate)
          }
        });

        let tutorUser;

        if (tutorId) {
          // Usar tutor existente
          tutorUser = await tx.user.findUnique({
            where: { idUser: tutorId }
          });

          if (!tutorUser) {
            throw new Error("Tutor especificado no encontrado");
          }

          // Buscar si ya existe una relación (aunque esté inactiva)
          const existingRelation = await tx.guardianChild.findFirst({
            where: {
              guardianId: tutorUser.idUser,
              childId: newChild.idChild
            }
          });

          if (existingRelation) {
            // Reactivar y actualizar la relación
            await tx.guardianChild.update({
              where: { idGuardianChild: existingRelation.idGuardianChild },
              data: {
                relationship: "TUTOR",
                active: true
              }
            });
          } else {
            // Crear nueva relación activa
            await tx.guardianChild.create({
              data: {
                guardianId: tutorUser.idUser,
                childId: newChild.idChild,
                relationship: "TUTOR",
                active: true
              }
            });
          }
        } else if (users && users.length > 0) {
          // Crear nuevo tutor
          const userData = users[0];
          
          // Verificar si el usuario ya existe
          const existingUser = await tx.user.findFirst({
            where: { 
              identification: userData.identification,
              active: true 
            }
          });

          if (existingUser) {
            throw new Error(`El tutor con cédula "${userData.identification}" ya existe.`);
          }

          // Obtener el rol de tutor
          const tutorRole = await tx.role.findFirst({
            where: { name: "TUTOR" }
          });

          if (!tutorRole) {
            throw new Error("Rol de tutor no encontrado");
          }

          // Crear el nuevo usuario/tutor
          tutorUser = await tx.user.create({
            data: {
              ...userData,
              roleId: tutorRole.idRole,
              password: "defaultPassword123", // Contraseña temporal
              active: true
            }
          });

          // Buscar si ya existe una relación (aunque esté inactiva)
          const existingRelation = await tx.guardianChild.findFirst({
            where: {
              guardianId: tutorUser.idUser,
              childId: newChild.idChild
            }
          });

          if (existingRelation) {
            // Reactivar y actualizar la relación
            await tx.guardianChild.update({
              where: { idGuardianChild: existingRelation.idGuardianChild },
              data: {
                relationship: "TUTOR",
                active: true
              }
            });
          } else {
            // Crear nueva relación activa
            await tx.guardianChild.create({
              data: {
                guardianId: tutorUser.idUser,
                childId: newChild.idChild,
                relationship: "TUTOR",
                active: true
              }
            });
          }
        } else {
          throw new Error("Debe especificar un tutor existente o datos para crear uno nuevo");
        }

        // Crear registros de vacunas si se proporcionaron
        if (vaccineRecords && vaccineRecords.length > 0) {
          for (const record of vaccineRecords) {
            const vaccine = await tx.vaccine.findFirst({
              where: { name: record.vaccineName }
            });

            if (vaccine) {
              await tx.record.create({
                data: {
                  childId: newChild.idChild,
                  vaccineId: vaccine.idVaccine,
                  dosesApplied: record.dosesApplied,
                  notes: record.notes || "",
                  dateApplied: new Date(),
                  userId: tutorUser.idUser,
                  active: true
                }
              });
            }
          }
        }

        return res.status(201).json({
          message: "Niño y tutor creados exitosamente",
          data: { 
            child: newChild, 
            tutor: {
              idUser: tutorUser.idUser,
              firstName: tutorUser.firstName,
              lastName: tutorUser.lastName,
              email: tutorUser.email
            }
          }
        });
      });
    } catch (error) {
      console.error('Error creating child with tutor:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async updateChildWithTutor(req: Request, res: Response): Promise<any> {
    try {
      const { child, users, relations, tutorId, vaccineRecords } = req.body;

      // Verificar si el niño existe
      const existingChild = await prisma.child.findFirst({
        where: { 
          identification: child.identification, 
          active: true 
        }
      });

      if (!existingChild) {
        return res.status(404).json({ 
          message: `El niño con cédula "${child.identification}" no existe.` 
        });
      }

      return await prisma.$transaction(async (tx) => {
        // Actualizar datos del niño
        const updatedChild = await tx.child.update({
          where: { idChild: existingChild.idChild },
          data: {
            firstName: child.firstName,
            lastName: child.lastName,
            gender: child.gender,
            nationality: child.nationality,
            city: child.city,
            municipality: child.municipality,
            birthDate: new Date(child.birthDate)
          }
        });

        let tutorUser;

        // Siempre desactivar todas las relaciones anteriores
        await tx.guardianChild.updateMany({
          where: {
            childId: existingChild.idChild,
            active: true
          },
          data: { active: false }
        });

        if (tutorId) {
          // Usar tutor existente
          tutorUser = await tx.user.findUnique({
            where: { idUser: String(tutorId) }
          });

          if (!tutorUser) {
            throw new Error("Tutor especificado no encontrado");
          }

          // Buscar si ya existe una relación (aunque esté inactiva)
          const existingRelation = await tx.guardianChild.findFirst({
            where: {
              guardianId: tutorUser.idUser,
              childId: existingChild.idChild
            }
          });

          if (existingRelation) {
            // Reactivar y actualizar la relación
            await tx.guardianChild.update({
              where: { idGuardianChild: existingRelation.idGuardianChild },
              data: {
                relationship: "TUTOR",
                active: true
              }
            });
          } else {
            // Crear nueva relación activa
            await tx.guardianChild.create({
              data: {
                guardianId: tutorUser.idUser,
                childId: existingChild.idChild,
                relationship: "TUTOR",
                active: true
              }
            });
          }
        } else if (users && users.length > 0) {
          // Crear o actualizar tutor
          const userData = users[0];
          const existingUser = await tx.user.findFirst({
            where: { identification: userData.identification, active: true }
          });

          if (existingUser) {
            tutorUser = await tx.user.update({
              where: { idUser: existingUser.idUser },
              data: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone
              }
            });
          } else {
            const tutorRole = await tx.role.findFirst({ where: { name: "TUTOR" } });
            if (!tutorRole) throw new Error("Rol de tutor no encontrado");
            tutorUser = await tx.user.create({
              data: {
                ...userData,
                roleId: tutorRole.idRole,
                password: "defaultPassword123",
                active: true
              }
            });
          }

          // Buscar si ya existe una relación (aunque esté inactiva)
          const existingRelation = await tx.guardianChild.findFirst({
            where: {
              guardianId: tutorUser.idUser,
              childId: existingChild.idChild
            }
          });

          if (existingRelation) {
            // Reactivar y actualizar la relación
            await tx.guardianChild.update({
              where: { idGuardianChild: existingRelation.idGuardianChild },
              data: {
                relationship: "TUTOR",
                active: true
              }
            });
          } else {
            // Crear nueva relación activa
            await tx.guardianChild.create({
              data: {
                guardianId: tutorUser.idUser,
                childId: existingChild.idChild,
                relationship: "TUTOR",
                active: true
              }
            });
          }
        }

        // Actualizar registros de vacunas si se proporcionaron
        if (vaccineRecords && vaccineRecords.length > 0) {
          // Desactivar registros anteriores
          await tx.record.updateMany({
            where: {
              childId: existingChild.idChild,
              active: true
            },
            data: { active: false }
          });

          // Crear nuevos registros
          for (const record of vaccineRecords) {
            const vaccine = await tx.vaccine.findFirst({
              where: { name: record.vaccineName }
            });

            if (vaccine) {
              if (!tutorUser) {
                throw new Error("No se pudo determinar el tutor/usuario responsable para el registro de vacuna.");
              }
              await tx.record.create({
                data: {
                  childId: existingChild.idChild,
                  vaccineId: vaccine.idVaccine,
                  dosesApplied: record.dosesApplied,
                  notes: record.notes || "",
                  dateApplied: record.applicationDate ? new Date(record.applicationDate) : new Date(),
                  userId: tutorUser.idUser,
                  active: true
                }
              });
            }
          }
        }

        // Obtener tutores activos
        const activeTutors = await tx.guardianChild.findMany({
          where: {
            childId: existingChild.idChild,
            active: true
          },
          include: {
            guardian: {
              select: {
                idUser: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });

        // Obtener vacunas activas
        const activeVaccines = await tx.record.findMany({
          where: {
            childId: existingChild.idChild,
            active: true
          },
          include: {
            vaccine: true,
            user: {
              select: {
                idUser: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });

        return res.status(200).json({
          message: "Niño actualizado exitosamente",
          data: {
            child: updatedChild,
            tutores: activeTutors,
            vacunas: activeVaccines
          }
        });
      });
    } catch (error) {
      console.error('Error updating child with tutor:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export default new ChildController();
