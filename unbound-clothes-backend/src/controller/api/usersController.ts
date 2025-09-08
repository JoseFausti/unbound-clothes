import { Request, Response } from "express";
import { connectIds, hashPassword, includeByUserRole } from "../../utils/functions";
import { ErrorResponse } from "../../types/types";
import { userModel } from "../../models/user/userModel";
import { IUser } from "../../models/user/userModel.interface";
import { UserRole } from "@prisma/client";
import { directionModel } from "../../models/directions/directionsModel";
import { IDirection } from "../../models/directions/directionsModel.interface";

export const getAllUsers = async (req: Request, res: Response): Promise<Response<IUser[] | ErrorResponse>> => {
    try {
        const users = await userModel.findMany({ 
            where: { deleted: false, role: { not: UserRole.SUPER_ADMIN }},
            include: {
                cart: true,
                directions: true,
                sellerProducts: true
            }
        });
        if (!users) throw new Error();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch users" });
    }
}

export const getUserById = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const userId = req.params.id;
        const user = await userModel.findUnique({ 
            where: { id: userId },
            include: {
                cart: true,
                directions: true,
                sellerProducts: true
            }
        });
        if (user && !user.deleted && user.role !== UserRole.SUPER_ADMIN) return res.status(200).json(user);
        return res.status(404).json({ error: "User not found" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch user" });
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response<ErrorResponse>> => {
    try {
        const userId = req.params.id;
        const user = await userModel.findUnique({ where: { id: userId } });
        if (!user || user.deleted) return res.status(404).json({ error: "User not found" });
        if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) return res.status(400).json({ error: "Cannot delete admin" });
        const deletedUser = await userModel.update({
            where: { id: userId },
            data: { deleted: true },
            include: {
                cart: true,
                directions: true,
                sellerProducts: true
            }
        });
        if (!deletedUser) throw new Error();
        return res.status(200).json(deletedUser);
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete user" });
    }
}

export const restoreUser = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const userId = req.params.id;
        const user = await userModel.findUnique({ where: { id: userId } });
        if (!user || !user.deleted) return res.status(404).json({ error: "User not found or not deleted" });
        const restoredUser = await userModel.update({
            where: { id: userId },
            data: { deleted: false },
            include: {
                cart: true,
                directions: true,
                sellerProducts: true
            }
        });
        if (!restoredUser) throw new Error();
        return res.status(200).json(restoredUser);
    } catch (error) {
        return res.status(500).json({ error: "Failed to restore user" });
    }
}


// Customer
export const createCustomer = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const { name, email, imageUrl, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });
        const hashedPassword = await hashPassword(password);
        const newCustomer = await userModel.create({ 
            data: { 
                name, 
                email, 
                imageUrl, 
                password: hashedPassword,
             },
            include: includeByUserRole(UserRole.USER)
        });
        if (!newCustomer) throw new Error();
        return res.status(201).json(newCustomer);
    } catch (error) {
        return res.status(500).json({ error: "Failed to create customer" });
    }
};

export const updateCustomer = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const userId = req.params.id;
        const { name, email, imageUrl, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });
        const hashedPassword = await hashPassword(password);
        const user = await userModel.findUnique({ where: { id: userId } });
        if (!user || user.deleted || user.role !== UserRole.USER) return res.status(404).json({ error: "User not found" });
        const updatedCustomer = await userModel.update({
            where: { id: userId },
            data: { name, email, imageUrl, password: hashedPassword },
            include: includeByUserRole(UserRole.USER)
        });
        if (!updatedCustomer) throw new Error();
        return res.status(200).json(updatedCustomer);
    } catch (error) {
        return res.status(500).json({ error: "Failed to update customer" });
    }
}

// Seller
export const createSeller = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const { name, email, imageUrl, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });
        const hashedPassword = await hashPassword(password);
        const newSeller = await userModel.create({ 
            data: { 
                name, 
                email, 
                imageUrl, 
                password: hashedPassword,
                role: UserRole.SELLER
             },
            include: includeByUserRole(UserRole.SELLER)
        });
        if (!newSeller) throw new Error();
        return res.status(201).json(newSeller);
    } catch (error) {
        return res.status(500).json({ error: "Failed to create seller" });
    }
}

export const updateSeller = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const userId = req.params.id;
        const { name, email, imageUrl, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });
        const hashedPassword = await hashPassword(password);
        const user = await userModel.findUnique({ where: { id: userId } });
        if (!user || user.deleted || user.role !== UserRole.SELLER) return res.status(404).json({ error: "User not found" });
        const updatedSeller = await userModel.update({
            where: { id: userId },
            data: { name, email, imageUrl, password: hashedPassword },
            include: includeByUserRole(UserRole.SELLER)
        });
        if (!updatedSeller) throw new Error();
        return res.status(200).json(updatedSeller);
    } catch (error) {
        return res.status(500).json({ error: "Failed to update seller" });
    }
}

// Admin
export const createAdmin = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const { name, email, imageUrl, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });
        const hashedPassword = await hashPassword(password);
        const newAdmin = await userModel.create({ 
            data: { 
                name, 
                email, 
                imageUrl, 
                password: hashedPassword,
                role: UserRole.ADMIN
            }
        });
        if (!newAdmin) throw new Error();
        return res.status(201).json(newAdmin);
    } catch (error) {
        return res.status(500).json({ error: "Failed to create admin" });
    }
}

export const updateAdmin = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const userId = req.params.id;
        const { name, email, imageUrl, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });
        const hashedPassword = await hashPassword(password);
        const user = await userModel.findUnique({ where: { id: userId } });
        if (!user || user.deleted || user.role !== UserRole.ADMIN) return res.status(404).json({ error: "User not found" });
        const updatedAdmin = await userModel.update({
            where: { id: userId },
            data: { name, email, imageUrl, password: hashedPassword }
        });
        if (!updatedAdmin) throw new Error();
        return res.status(200).json(updatedAdmin);
    } catch (error) {
        return res.status(500).json({ error: "Failed to update admin" });
    }
}

export const deleteAdmin = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const userId = req.params.id;
        const user = await userModel.findUnique({ where: { id: userId } });
        if (!user || user.deleted || user.role !== UserRole.ADMIN) return res.status(404).json({ error: "User not found" });
        const deletedAdmin = await userModel.update({
            where: { id: userId },
            data: { deleted: true }
        });
        if (!deletedAdmin) throw new Error();
        return res.status(200).json(deletedAdmin);
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete admin" });
    }
}

export const restoreAdmin = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const userId = req.params.id;
        const user = await userModel.findUnique({ where: { id: userId } });
        if (!user || !user.deleted || user.role !== UserRole.ADMIN) return res.status(404).json({ error: "User not found or not deleted" });
        const restoredAdmin = await userModel.update({
            where: { id: userId },
            data: { deleted: false }
        });
        if (!restoredAdmin) throw new Error();
        return res.status(200).json(restoredAdmin);
    } catch (error) {
        return res.status(500).json({ error: "Failed to restore admin" });
    }
}

export const changeUserRole = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const userId = req.params.id;
        const { role } = req.body;
        const user = await userModel.findUnique({ 
            where: { id: userId }, 
            include: {
                cart: true,
                directions: true,
                sellerProducts: true
            }
        });
        if (!user || user.deleted || user.role === UserRole.SUPER_ADMIN) return res.status(404).json({ error: "User not found" });
        const updatedUser = await userModel.update({
            where: { id: userId },
            data: { 
                role,
                cart: user.cart ? { delete: true}: undefined,
                directions: { deleteMany: {} },
                sellerProducts: { deleteMany: {} }
            }
        });
        if (!updatedUser) throw new Error();
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ error: "Failed to change user role" });
    }
}