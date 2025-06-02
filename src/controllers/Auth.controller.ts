import { Request, Response } from "express";
import prisma from "../db/prisma";
import { RegisterUserDTO } from "../DTOs/RegisterUserDTO";

export class AuthController {
  static async register(req: Request, res: Response): Promise<any> {
    try {
      const {
        identification,
        name,
        password,
        phone,
        role,
        email,
        supervisor
      }:RegisterUserDTO = req.body;

      const userFounded = await prisma.user.findUnique({
        where: { identification },
      });
      
      if (!userFounded) {
        return res.status(409).json({ message: "User is registered" });
      }
      // Hash the password
      const securePassword = await Bun.password.hash(password);

      const newUser = await prisma.user.create({data: {
        identification,
        name,
        password: securePassword,
        phone,
        roleId: role,
        ...(email && {email}),
        supervisorId: supervisor
      }});

      console.log(newUser);
      res.send(201).json({ message: "User registered" });
    } catch (error) {
        return res.sendStatus(501); 
    }
  }

  static async logIn() {}

  static logOut() {}
}



