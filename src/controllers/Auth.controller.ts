import { Request, Response } from "express";
import { RegisterUserDTO } from "../DTOs/RegisterUserDTO";
import { LogInUserDTO } from "../DTOs/LogInUserDTO";
import prisma from "../db/prisma";
import jwt from "jsonwebtoken";

export class AuthController {
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
      } = req.body as RegisterUserDTO;

      const userFounded = await prisma.user.findUnique({
        where: { identification },
      });

      if (userFounded) {
        return res.status(409).json({ message: "User is registered" });
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

      console.log(newUser);
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
      const userFounded = await prisma.user.findUnique({
        where: { identification },
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
      const token = jwt.sign({ id: userFounded.idUser }, JWT_KEY, {
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

  static logOut(req: Request, res: Response): any {
    res.cookie("token", "");
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
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userProfile } = user;
      return res.status(200).json({ user: userProfile });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
