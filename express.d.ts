import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Puedes definir el tipo específico en lugar de any
    }
  }
}
