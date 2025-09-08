import jwt, { JwtPayload } from "jsonwebtoken";
import {jwtConfig} from "../config/config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserRole } from "@prisma/client";

export const connectIds = <T extends { id: string }>(items?: T[]) => {
  return Array.isArray(items) && items.length
    ? { connect: items.map((item) => ({ id: item.id })) }
    : undefined;
};

export const disconnectIds = <T extends { id: string }>(items?: T[]) => {
  return Array.isArray(items) && items.length
    ? { disconnect: items.map((item) => ({ id: item.id })) }
    : undefined;
}

export const includeByUserRole = (role: UserRole) => {
  if (role === UserRole.USER) return { cart: true, directions: true };
  if (role === UserRole.SELLER) return { sellerProducts: true };
  return {};
}

export const isAdmin = (token: string): boolean => {
  try {
    const decoded = jwt.verify(token, jwtConfig.jwtSecret!) as JwtPayload;
    return decoded.role === UserRole.ADMIN || decoded.role === UserRole.SUPER_ADMIN;

  } catch (error) {
    return false;
  }
}

export const isSuperAdmin = (token: string): boolean => {
  try {
    const decoded = jwt.verify(token, jwtConfig.jwtSecret!) as JwtPayload;
    return decoded.role === UserRole.SUPER_ADMIN;

  } catch (error) {
    return false;
  }
}

export const generateToken = (payload: JwtPayload, expiresIn: jwt.SignOptions['expiresIn'] = '1d'): string => {
  return jwt.sign(payload , jwtConfig.jwtSecret!, { expiresIn });
};

export const isValidToken = (token: string) => {
  try {
    const decodedToken = jwt.verify(token, jwtConfig.jwtSecret!);
    return !!decodedToken;
  } catch {
    return false;
  }
};

export const hashPassword = async (password: string, salt: number = 10): Promise<string> => {
  return bcrypt.hash(password, salt);
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
}

export const hashFile = (file: Buffer): string => {
  const hash = crypto.createHash("sha256").update(file).digest("hex");
  return hash;
}

export const extractPublicId = (imageUrl: string): string => {
  const index = imageUrl.indexOf("unbound-clothes/uploads/");
  const publicId = imageUrl.substring(index).split(".")[0];
  return publicId;
};

export const validateAddress = (address: string): boolean => {
  const addressRegex = /^[A-Z][a-zA-Z\s]+ \d+, [A-Z][a-zA-Z\s]+, [A-Z][a-zA-Z\s]+$/;
  return addressRegex.test(address);
};