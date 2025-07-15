import { Request, Response } from "express";
import { AddChildDTO } from "../DTOs/AddChildDTO";
import prisma from "../db/prisma";
import { z } from "zod";
import { updateChildWithTutorSchema } from "../schemas/child.schema";

type UpdateChildWithTutorBody = z.infer<typeof updateChildWithTutorSchema>;

export class ChildController {
  static async getAllChilds(req: Request, res: Response): Promise<any> {
    try {
      const Childs = await prisma.child.findMany({
        where: { active: true },
        include: {
          guardianChildren: {
            include: {
              guardian: true
            }
          }
        },
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

  static async getAvailableTutors(req: Request, res: Response): Promise<any> {
    try {
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

      const user = await prisma.user.findFirst({
        where: { identification: userIdentification, active: true }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

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

      const user = await prisma.user.findFirst({
        where: { identification: userIdentification, active: true }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

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

      
      const birthDate = new Date(child.birthDate);
      const now = new Date();
      const ageInMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + 
                         (now.getMonth() - birthDate.getMonth());

      const requiredVaccines = await prisma.vaccineSchema.findMany({
        where: {
          age: { lte: ageInMonths },
          active: true
        },
        include: {
          vaccine: true
        }
      });

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

  static async generateVaccinationCard(req: Request, res: Response): Promise<any> {
    try {
      const { childId } = req.params;
      const userIdentification = (req as any).user?.identification;
      
      if (!userIdentification) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const user = await prisma.user.findFirst({
        where: { identification: userIdentification, active: true }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

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

      const child = await prisma.child.findUnique({
        where: { idChild: childId }
      });

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
      const userId = (req as any).user?.idUser;
      const userIdentification = (req as any).user?.identification;
      
      if (!userId && !userIdentification) {
        return res.status(401).json({ message: 'No autenticado' });
      }

      let user;
      if (userId) {
        user = await prisma.user.findFirst({
          where: { idUser: userId, active: true }
        });
      } else {
        user = await prisma.user.findFirst({
          where: { identification: userIdentification, active: true }
        });
      }

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

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

      
      const now = new Date();
      const birthDate = new Date(child.birthDate);
      const ageInMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + 
                         (now.getMonth() - birthDate.getMonth());

      const applicableSchemas = await prisma.vaccineSchema.findMany({
        where: {
          age: { lte: ageInMonths },
          active: true
        },
        include: {
          vaccine: true
        }
      });

      
      const appliedVaccines = await prisma.record.findMany({
        where: {
          childId: childId,
          active: true
        },
        include: {
          vaccine: true
        }
      });

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
      const { child, users, relationships, tutorId, vaccineRecords } = req.body;

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
        const newChild = await tx.child.create({
          data: {
            ...child,
            birthDate: new Date(child.birthDate)
          }
        });

        
        if (!relationships || relationships.length === 0) {
          return res.status(400).json({ 
            message: "Debe proporcionar al menos una relación de tutor para el niño." 
          });
        }

        let responsibleUser;

        
        for (const relation of relationships) {
          let tutor = await tx.user.findFirst({
            where: { 
              identification: relation.identificationUser, 
              active: true 
            }
          });

          
          if (!tutor && users && users.length > 0) {
            const userData = users.find((u: any) => u.identification === relation.identificationUser);
            if (userData) {
              
              const tutorRole = await tx.role.findFirst({
                where: { name: "TUTOR" }
              });

              if (!tutorRole) {
                throw new Error("Rol de tutor no encontrado");
              }

              
              tutor = await tx.user.create({
                data: {
                  ...userData,
                  roleId: tutorRole.idRole,
                  active: true
                }
              });
            }
          }

          if (!tutor) {
            console.warn(`Tutor con identificación ${relation.identificationUser} no encontrado o no se pudieron crear`);
            continue;
          }

          
          if (!responsibleUser) {
            responsibleUser = tutor;
          }

          const existingRelation = await tx.guardianChild.findFirst({
            where: {
              guardianId: tutor.idUser,
              childId: newChild.idChild
            }
          });

          if (existingRelation) {
            await tx.guardianChild.update({
              where: { idGuardianChild: existingRelation.idGuardianChild },
              data: {
                relationship: relation.relationship,
                active: true
              }
            });
          } else {
            await tx.guardianChild.create({
              data: {
                guardianId: tutor.idUser,
                childId: newChild.idChild,
                relationship: relation.relationship,
                active: true
              }
            });
          }
        }

        
        if (!responsibleUser) {
          throw new Error("No se pudo establecer un tutor responsable para el niño");
        }

        
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
                  userId: responsibleUser.idUser,
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
              idUser: responsibleUser.idUser,
              firstName: responsibleUser.firstName,
              lastName: responsibleUser.lastName,
              email: responsibleUser.email
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
      const { child, users, tutorId, vaccineRecords, relationships } = req.body as UpdateChildWithTutorBody;
      
      const existingChild = await prisma.child.findUnique({
        where: { idChild: child.idChild }
      });

      if (!existingChild) {
        return res.status(404).json({ 
          message: `El niño con cédula "${child.identification}" no existe.` 
        });
      }

      return await prisma.$transaction(async (tx) => {
        const updatedChild = await tx.child.update({
          where: { idChild: existingChild.idChild },
          data: {
            firstName: child.firstName,
            lastName: child.lastName,
            identification: child.identification,
            gender: child.gender,
            nationality: child.nationality,
            city: child.city,
            municipality: child.municipality,
            birthDate: new Date(child.birthDate)
          }
        });

        
        if (!relationships || relationships.length === 0) {
          return res.status(400).json({ 
            message: "Debe proporcionar al menos una relación de tutor para el niño." 
          });
        }

        
        const identificationChild = child.identification;
        const tutorIdentifications = relationships.map(r => r.identificationUser);
        await tx.guardianChild.updateMany({
          where: {
            child: { identification: identificationChild },
            guardian: { identification: { in: tutorIdentifications } },
            active: true
          },
          data: { active: false }
        });

        
        for (const relation of relationships) {
          const tutor = await tx.user.findFirst({
            where: { 
              identification: relation.identificationUser, 
              active: true 
            }
          });

          if (!tutor) {
            console.warn(`Tutor con identificación ${relation.identificationUser} no encontrado o inactivo`);
            continue;
          }

          const existingRelation = await tx.guardianChild.findFirst({
            where: {
              guardianId: tutor.idUser,
              childId: existingChild.idChild
            }
          });

          if (existingRelation) {
            await tx.guardianChild.update({
              where: { idGuardianChild: existingRelation.idGuardianChild },
              data: {
                relationship: relation.relationship,
                active: true
              }
            });
          } else {
            await tx.guardianChild.create({
              data: {
                guardianId: tutor.idUser,
                childId: existingChild.idChild,
                relationship: relation.relationship,
                active: true
              }
            });
          }
        }

        if (vaccineRecords && vaccineRecords.length > 0) {
          
          const firstActiveRelation = await tx.guardianChild.findFirst({
            where: { childId: existingChild.idChild, active: true },
            include: { guardian: true }
          });

          let responsibleUser;
          if (firstActiveRelation?.guardian) {
            responsibleUser = firstActiveRelation.guardian;
          } else {
            
            const loggedInUser = await tx.user.findUnique({ 
              where: { idUser: (req as any).user?.idUser } 
            });
            if (!loggedInUser) {
              throw new Error("No se pudo determinar un usuario responsable para el registro.");
            }
            responsibleUser = loggedInUser;
          }

          const existingDbRecords = await tx.record.findMany({
            where: { childId: existingChild.idChild },
            include: { vaccine: true }
          });
          const dbRecordMap = new Map(existingDbRecords.map(r => [r.vaccine.name, r]));
          const incomingVaccineNames = new Set(vaccineRecords.map(r => r.vaccineName));
          const allVaccines = await tx.vaccine.findMany();
          const vaccineMap = new Map(allVaccines.map(v => [v.name, v.idVaccine]));

          
          for (const dbRecord of existingDbRecords) {
            if (dbRecord.active && !incomingVaccineNames.has(dbRecord.vaccine.name)) {
              await tx.record.update({
                where: { idRecord: dbRecord.idRecord },
                data: { active: false }
              });
            }
          }

          
          for (const incomingRecord of vaccineRecords) {
            const vaccineId = vaccineMap.get(incomingRecord.vaccineName);
            if (!vaccineId) {
              continue;
            }

            const existingRecord = dbRecordMap.get(incomingRecord.vaccineName);

            if (existingRecord) {
              await tx.record.update({
                where: { idRecord: existingRecord.idRecord },
                data: {
                  dosesApplied: incomingRecord.dosesApplied,
                  notes: incomingRecord.notes || "",
                  dateApplied: incomingRecord.applicationDate ? new Date(incomingRecord.applicationDate) : new Date(),
                  active: true
                }
              });
            } else {
              
              await tx.record.create({
                data: {
                  childId: existingChild.idChild,
                  vaccineId,
                  dosesApplied: incomingRecord.dosesApplied,
                  notes: incomingRecord.notes || "",
                  dateApplied: incomingRecord.applicationDate ? new Date(incomingRecord.applicationDate) : new Date(),
                  userId: responsibleUser.idUser,
                  active: true
                }
              });
            }
          }
        }

        
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
