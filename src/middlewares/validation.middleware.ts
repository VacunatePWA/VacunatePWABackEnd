import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateSchema =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): any => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      error instanceof ZodError ?
      res.status(400).json(error.errors.map(e => e.message))
      : res.status(500).json({message: "Internal server error"});
    }
  };


