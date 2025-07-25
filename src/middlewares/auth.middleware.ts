import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CookiesDTO } from "../DTOs/CookiesDTO";

const { JWT_KEY } = process.env;

export const validateAccess = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  if (!JWT_KEY)
    return res.status(501).json({ message: "JWT_KEY is not defined in .env file" });

  const { token } = req.cookies as CookiesDTO;
  
  if (!token) return res.status(401).json({ message: "Invalid credentials" });

  const decoded = jwt.decode(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const { exp } = decoded as JwtPayload;
  if (!exp)
    return res.status(401).json({ message: "Token doesn't have expire time" });

  if (Date.now() >= exp * 1000)
    return res.status(401).json({ message: "Token has expired" });

  jwt.verify(token, JWT_KEY, (err, decode) => {
    if (err) return res.status(401).json({ message: "Invalid credentials" });
    
    // Normaliza el usuario para que siempre tenga idUser e identification
    if (decode && typeof decode === 'object') {
      const user = {
        ...decode,
        idUser: (decode as any).idUser || (decode as any).id || (decode as any).userId,
        identification: (decode as any).identification || (decode as any).cedula || (decode as any).ident
      };
      
      req.user = user;
    } else {
      req.user = decode;
    }
    next();
  });
};

// Alias para compatibilidad
export const authMiddleware = validateAccess;

