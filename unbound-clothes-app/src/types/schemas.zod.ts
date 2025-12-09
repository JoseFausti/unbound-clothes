import { z } from "zod";
import { categories } from "./schemas.db";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[A-Z][a-zA-Z\s]*$/, "Name must start with a capital letter"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^[A-Z]/, "Password must start with an uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("El email no es válido"),
  password: z.string().min(1, "La contraseña es obligatoria")
})

export type LoginValues = z.infer<typeof loginSchema>

export const personalInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[A-Z][a-zA-Z\s]*$/, "Name must start with a capital letter"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^[A-Z]/, "Password must start with an uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const directionSchema = z.object({
  street: z
    .string()
    .min(1, "Street is required")
    // Allows letters, numbers, dots, accents, ñ and spaces
    .regex(/^[\w\sÁÉÍÓÚáéíóúÑñ.]+$/, "Street cannot contain special characters"),

  number: z
    .string()
    .min(1, "Number is required")
    .regex(/^\d+$/, "Number must be numeric"),

  city: z
    .string()
    .min(1, "City is required")
    // Allows letters, accents, ñ, spaces and dots (no numbers)
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.]+$/, "City cannot contain numbers or special characters"),

  province: z
    .string()
    .min(1, "Province is required")
    // Allows letters, accents, ñ, spaces and dots (no numbers)
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.]+$/, "Province cannot contain numbers or special characters"),
});

export type DirectionValues = z.infer<typeof directionSchema>;

export const createProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than 0"),
  category: z.enum(categories as [string, ...string[]]),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const createProductVariantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  stock: z.number().min(1, "Stock must be at least 1"),
});

export type CreateProductVariantInput = z.infer<typeof createProductVariantSchema>;

export const updateDiscountSchema = z.object({
  discounts: z
    .array(
      z.object({
        percentage: z.number().min(1).max(90, "Max discount is 90%"),
        startDate: z.string().nonempty("Start date is required"),
        endDate: z.string().nonempty("End date is required"),
      })
    )
});

// Admin
export const createEditUserSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'SELLER', 'ADMIN', 'SUPER_ADMIN'])
})

export type CreateEditUserValues = z.infer<typeof createEditUserSchema>