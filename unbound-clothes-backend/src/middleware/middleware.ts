
import { Request, Response, NextFunction } from "express";
import { decodeToken, isValidToken } from "../utils/functions";
import { UserRole } from "@prisma/client";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || !isValidToken(token)) return res.status(401).json({ message: "Unauthorized" });
  next();
};

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      const decoded = decodeToken(token);
      if (!decoded) return res.status(401).json({ message: 'Invalid token' });

      if (!allowedRoles.includes(decoded.role as UserRole)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

// Middlewares
export const isSellerMiddleware = authorizeRoles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN);
export const isAdminMiddleware = authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN);
export const isSuperAdminMiddleware = authorizeRoles(UserRole.SUPER_ADMIN);
