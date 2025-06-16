import { Request, Response } from "express";
import {RegisterUserDTO } from "../DTOs/RegisterUserDTO";
import prisma from "../db/prisma";
import { LogInUserDTO } from "../DTOs/LogInUserDTO";

export class AuthController {
  
  static async register(req: Request, res: Response): Promise<Response> {
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
        supervisor,
      } = req.body as RegisterUserDTO;

      const userFounded = await prisma.user.findUnique({
        where: { identification },
      });

      if (userFounded) {
        return res.status(409).json({ message: "User is registered" });
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
          roleId: role,
          email,
          supervisorId: supervisor,
        },
      });

      console.log(newUser);
      return res.status(201).json({ message: "User registered" });
    } catch (error) {
      return res.sendStatus(500);
    }
  }

// // // //   // static async logIn(req: Request, res:Response): Promise<Response> {
// // // //   //   const {identification, password} = req.body as LogInUserDTO;

// const userFounded = await prisma.user.findUnique({where: {identification}});

//  if(!userFounded){

// }

// static logOut() {}
}
