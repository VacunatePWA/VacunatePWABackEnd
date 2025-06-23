import { Request, Response } from "express";
import { RegisterUserDTO } from "../DTOs/RegisterUserDTO";
import { LogInUserDTO } from "../DTOs/LogInUserDTO";
import prisma from "../db/prisma";
import jwt from "jsonwebtoken";

export class AuthController {

  static async getAllUsers(req: Request, res: Response): Promise<any> {
    try {
      const Vaccines = await prisma.user.findMany({
        where: { active: true },

        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(Vaccines);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async getUsersByRole(req: Request, res: Response): Promise<any> {
    try {
      const { roleName } = req.params;

      const users = await prisma.user.findMany({
        where: { 
          active: true,
          role: {
            name: roleName
          }
        },
        include: {
          role: {
            select: {
              idRole: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static async register(req: Request, res: Response): Promise<any> {
    try {
      const {
        firstName,
        lastName,
        identificationType,
        identification,
        password,
        phone,
        role,
        email,
        supervisorIdentification,
        idClinic,
      } = req.body as RegisterUserDTO;

      const userFounded = await prisma.user.findFirst({
        where: { identification, active: true },
      });

      if (userFounded) {
        return res.status(409).json({ message: "User is registered and active" });
      }

      let supervisorId: string | null = null;

      if (supervisorIdentification) {
        const supervisorFounded = await prisma.user.findFirst({
          where: { identification: supervisorIdentification },
        });

        if (!supervisorFounded) {
          return res.status(400).json({ message: "Supervisor doesn't exist" });
        }

        supervisorId = supervisorFounded.idUser;
      }

      const roleFounded = await prisma.role.findUnique({
        where: { name: role },
      });

      if (!roleFounded) {
        return res.status(400).json({ message: "Role doesn't exist" });
      }

      // Hash the password
      const securePassword = Bun.password.hashSync(password);

      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          identificationType,
          identification,
          password: securePassword,
          phone,
          roleId: roleFounded.idRole,
          email,
          supervisorId: supervisorId,
        },
      });

      // Si es doctor o enfermero y se proporcionó una clínica, crear la asignación
      if ((role === 'Doctor' || role === 'Enfermero') && idClinic) {
        try {
          await prisma.userClinic.create({
            data: {
              userId: newUser.idUser,
              clinicId: idClinic,
            },
          });
        } catch (clinicError) {
          console.error('Error asignando clínica al usuario:', clinicError);
          // No fallar el registro por esto, solo logear el error
        }
      }

      return res.status(201).json({ message: "User registered" });
    } catch (error) {
      return res
        .status(500)
        .json(error instanceof Error ? error.message : "Internal server error");
    }
  }

  static async logIn(req: Request, res: Response): Promise<any> {
    const { JWT_KEY } = process.env;

    if (!JWT_KEY)
      return res
        .status(501)
        .json({ message: "JWT_KEY is not defined in .env file" });

    const { identification, password } = req.body as LogInUserDTO;

    try {
      const userFounded = await prisma.user.findFirst({
        where: { identification, active: true },
      });

      if (!userFounded) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const verifyPassword = Bun.password.verifySync(
        password,
        userFounded.password
      );

      if (!verifyPassword)
        return res.status(401).json({ message: "Invalid credentials" });

      //Create JasonWebToken
      const token = jwt.sign({ 
        id: userFounded.idUser,
        idUser: userFounded.idUser,
        identification: userFounded.identification,
        firstName: userFounded.firstName,
        lastName: userFounded.lastName,
        email: userFounded.email,
        roleId: userFounded.roleId
      }, JWT_KEY, {
        expiresIn: "1h",
      });

      res.cookie("token", token, { httpOnly: false, secure: false });

      return res.sendStatus(202);
    } catch (error) {
      return res
        .status(500)
        .json(error instanceof Error ? error.message : "Internal server error");
    }
  }

  
static async deleteUser(req: Request, res: Response): Promise<any> {
    try {
      const { idUser } = req.body;

      const userFound = await prisma.user.findFirst({
        where: { idUser, active: true },
      });

      if (!userFound) {
        return res.status(404).json({ message: "User not found." });
      }

      await prisma.user.update({
        where: { idUser: userFound.idUser },
        data: { active: false },
      });
      return res.status(200).json({ message: "User deleted (set inactive)." });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  static logOut(req: Request, res: Response): any {
    res.clearCookie("token");
    res.sendStatus(200);
  }

  static async profile(req: Request, res: Response): Promise<any> {
    try {

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await prisma.user.findUnique({
        where: { idUser: userId },
        include: {
          role: {
            select: {
              idRole: true,
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
                  municipality: true,
                  phone: true
                }
              }
            }
          }
        }
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Extraer datos del usuario sin password y userClinics
      const { password, userClinics, ...userProfile } = user;
      
      // Extraer solo los centros del array de userClinics
      const assignedClinics = userClinics?.map((uc: any) => uc.clinic) || [];
      
      return res.status(200).json({ 
        user: {
          ...userProfile,
          assignedClinics
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
