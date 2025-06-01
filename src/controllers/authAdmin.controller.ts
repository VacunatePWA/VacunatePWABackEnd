import { Request, Response } from "express";
import prisma from "../db/prisma";
import { User } from "@prisma/client";

export class authAdminController {
  static async register(req: Request, res: Response): Promise<any> {
    const {
      name,
      email,
      identification,
      password,
      phone,
      roleId,
      stateId,
      supervisorId,
    }: User = req.body;

    const userFounded = await prisma.user.findUnique({
      where: { identification },
    });

    if (userFounded) {
      return res.status(409).json({ message: "User is registered" });
    }

    const hashPassword = Bun.password.hashSync(password);

    const newUser = await prisma.user.create({
      data: {
        identification,
        name,
        password: hashPassword,
        phone,
        email,
        roleId,
        stateId
      },
    });
  }

  static async logIn() {}

  static logOut() {}
}
