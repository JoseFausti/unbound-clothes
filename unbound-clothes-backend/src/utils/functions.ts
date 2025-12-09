import jwt, { JwtPayload } from "jsonwebtoken";
import {jwtConfig} from "../config/config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Category, UserRole } from "@prisma/client";
import { IProduct } from "../models/products/productModel.interface";
import { ClothingSize, ShoeSize } from "@prisma/client";

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

export const setIds = <T extends { id: string }>(items?: T[]) => {
  return Array.isArray(items) && items.length
    ? { set: items.map((item) => ({ id: item.id })) }
    : { set: [] };
};

export const includeByUserRole = (role: UserRole) => {
  if (role === UserRole.USER) return { cart: true, favorites: { include: { discounts: true }}, directions: true, orders: { include: { items: true, shippingDetail: true } }};
  if (role === UserRole.SELLER) return { sellerProducts: true };
  return {};
}

export const generateToken = (payload: JwtPayload, expiresIn: jwt.SignOptions['expiresIn'] = '1d'): string => {
  return jwt.sign(payload , jwtConfig.jwtSecret!, { expiresIn });
};

export const decodeToken = (token: string) => {
  const decodedToken = jwt.verify(token, jwtConfig.jwtSecret!);
  return decodedToken as JwtPayload;
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
  const unique = `${hash}-${Date.now()}`;
  return unique;
}

export const extractPublicId = (imageUrl: string): string => {
  const index = imageUrl.indexOf("unbound-clothes/uploads/");
  const publicId = imageUrl.substring(index).split(".")[0];
  return publicId;
};

export const validateAddress = (address: string): boolean => {

  // - Street: may include letters, numbers, dots, accents, ñ, and spaces. - Number: must be digits only.
  // - Number: must be digits only.
  // - City & Province: may include only letters, accents, ñ, dots, and spaces (no numbers).

  const addressRegex = /^[\w\sÁÉÍÓÚáéíóúÑñ.]+ \d+, [A-Za-zÁÉÍÓÚáéíóúÑñ\s.]+, [A-Za-zÁÉÍÓÚáéíóúÑñ\s.]+$/;
  return addressRegex.test(address.trim());
};

export const calculateDiscountedPrice = (product: IProduct): number => {
  const totalDiscount = product.discounts?.reduce((sum, d) => sum + d.percentage, 0) ?? 0;
  const clampedDiscount = Math.min(100, totalDiscount);
  return product.price * (1 - clampedDiscount / 100);
};


export const validateSize = (category: Category, size: string) => {

  const clothingCategories: Category[] = ["SHIRTS", "TSHIRTS", "SWEATSHIRTS", "JACKETS", "PANTS", "SHORTS", "UNDERWEAR"];
  const shoeCategories: Category[] = ["SNEAKERS", "BOOTS", "SANDALS"];

  if (clothingCategories.includes(category)) {
    if (!Object.values(ClothingSize).includes(size as ClothingSize)) {
      throw new Error("Invalid clothing size");
    }
    return;
  }

  if (shoeCategories.includes(category)) {
    if (!Object.values(ShoeSize).includes(size as ShoeSize)) {
      throw new Error("Invalid shoe size");
    }
    return;
  }

  if (category === "ACCESSORIES"){
    if (size !== null && size.trim() !== "" && size !== "ONE_SIZE") {
      throw new Error("Accessories should not have size or must be ONE_SIZE");
    }
    return;
  }

  throw new Error("Unknown category for size validation");
}
