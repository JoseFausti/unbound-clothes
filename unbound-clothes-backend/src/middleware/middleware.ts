
import { Request, Response, NextFunction } from "express";
import { isAdmin, isSuperAdmin, isValidToken } from "../utils/functions";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || !isValidToken(token)) return res.status(401).json({ message: "Unauthorized" });
  next();
};

export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || !isValidToken(token)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!isAdmin(token)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}

export const isSuperAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || !isValidToken(token)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!isSuperAdmin(token)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}