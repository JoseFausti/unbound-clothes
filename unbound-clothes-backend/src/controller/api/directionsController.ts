import { Request, Response } from "express";
import { IDirection } from "../../models/directions/directionsModel.interface";
import { ErrorResponse } from "../../types/types";
import { directionModel } from "../../models/directions/directionsModel";
import { userModel } from "../../models/user/userModel";
import { UserRole } from "@prisma/client";
import { validateAddress } from "../../utils/functions";

export const getAllDirections = async (req: Request, res: Response): Promise<Response<IDirection[] | ErrorResponse>> => {
    try {
        const directions = await directionModel.findMany({ where: { deleted: false } });
        if (!directions) throw new Error();
        return res.status(200).json(directions);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch directions" });
    }
}

export const getDirectionById = async (req: Request, res: Response): Promise<Response<IDirection | ErrorResponse>> => {
    try {
        const directionId = req.params.id;
        const direction = await directionModel.findUnique({ where: { id: directionId } });
        if (direction && !direction.deleted) return res.status(200).json(direction);
        return res.status(404).json({ error: "Direction not found" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch direction" });
    }
}

export const createDirection = async (req: Request, res: Response): Promise<Response<IDirection | ErrorResponse>> => {
    try {
        const {userId, address}: IDirection = req.body;
        if (!userId || !address?.trim()) return res.status(400).json({ error: "User ID and address are required" });
        const validAddress = validateAddress(address);
        if (!validAddress) return res.status(400).json({ error: "Invalid address format" });
        const user = await userModel.findUnique({ where: { id: userId } });
        if (!user || user.deleted || user.role !== UserRole.USER) return res.status(404).json({ error: "User not found" });
        const existingDirection = await directionModel.findFirst({ where: { userId, address }});
        if (existingDirection) return res.status(400).json({ error: "Direction already exists" });
        const newDirection = await directionModel.create({ data: { userId, address: address.trim()} });
        if (!newDirection) throw new Error();
        return res.status(201).json(newDirection);
    } catch (error) {
        return res.status(500).json({ error: "Failed to create direction" });
    }
}

export const updateDirection = async (req: Request, res: Response): Promise<Response<IDirection | ErrorResponse>> => {
    try {
        const directionId = req.params.id;
        const { userId, address }: IDirection = req.body;
        if (!userId || !address?.trim()) return res.status(400).json({ error: "User ID and address are required" });
        const validAddress = validateAddress(address);
        if (!validAddress) return res.status(400).json({ error: "Invalid address format" });
        const user = await userModel.findUnique({ where: { id: userId } });
        if (!user || user.deleted || user.role !== UserRole.USER) return res.status(404).json({ error: "User not found" });
        const existingDirection = await directionModel.findFirst({ where: { id: { not: directionId }, userId, address }});
        if (existingDirection) return res.status(400).json({ error: "Direction already exists" });
        const updatedDirection = await directionModel.update({ where: { id: directionId }, data: { address: address.trim() } });
        if (!updatedDirection) throw new Error();
        return res.status(200).json(updatedDirection);
    } catch (error) {
        return res.status(500).json({ error: "Failed to update direction" });
    }
}

export const deleteDirection = async (req: Request, res: Response): Promise<Response<IDirection | ErrorResponse>> => {
    try {
        const directionId = req.params.id;
        const direction = await directionModel.findUnique({ where: { id: directionId } });
        if (!direction || direction.deleted) return res.status(404).json({ error: "Direction not found" });
        const deletedDirection = await directionModel.update({ where: { id: directionId }, data: { deleted: true } });
        if (!deletedDirection) throw new Error();
        return res.status(200).json(deletedDirection);
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete direction" });
    }
}

export const restoreDirection = async (req: Request, res: Response): Promise<Response<IDirection | ErrorResponse>> => {
    try {
        const directionId = req.params.id;
        const direction = await directionModel.findUnique({ where: { id: directionId } });
        if (!direction || !direction.deleted) return res.status(404).json({ error: "Direction not found or not deleted" });
        const restoredDirection = await directionModel.update({ where: { id: directionId }, data: { deleted: false } });
        if (!restoredDirection) throw new Error();
        return res.status(200).json(restoredDirection);
    } catch (error) {
        return res.status(500).json({ error: "Failed to restore direction" });
    }
}
