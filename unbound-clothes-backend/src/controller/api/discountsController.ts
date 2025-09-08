import { Request, Response } from "express";
import { discountModel } from "../../models/discounts/discountModel";
import { IDiscount } from "../../models/discounts/discountModel.interface";
import { ErrorResponse } from "../../types/types";

export const getAllDiscounts = async (req: Request, res: Response): Promise<Response<IDiscount[] | ErrorResponse>> => {
  try {
    const discounts = await discountModel.findMany({ include: { products: true } });
    if (!discounts) throw new Error();
    return res.status(200).json(discounts);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch discounts" });
  }
};

export const getDiscountById = async (req: Request, res: Response): Promise<Response<IDiscount | ErrorResponse>> => {
    try {
        const discountId = req.params.id;
        const discount = await discountModel.findUnique({ 
            where: { id: discountId },
            include: { products: true }
        });
        if (discount) return res.status(200).json(discount);
        return res.status(404).json({ error: "Discount not found" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch discount" });
    }
}

export const createDiscount = async (req: Request, res: Response): Promise<Response<IDiscount | ErrorResponse>> => {
    try {
        const { percentage, startDate, endDate } = req.body;
        if (!percentage || !startDate || !endDate) return res.status(400).json({ error: "Missing required fields" });
        if (new Date(startDate) >= new Date(endDate)) return res.status(400).json({ error: "Start date must be before end date" });
        const existingDiscount = await discountModel.findFirst({ 
            where: { 
                percentage, 
                startDate: {lte: new Date(endDate)}, 
                endDate: {gte: new Date(startDate)} 
            }
        });
        if (existingDiscount) return res.status(400).json({ error: "Discount period overlaps with existing discount" });
        const newDiscount = await discountModel.create({
            data: {
                percentage,
                startDate,
                endDate
            }
        })
        if (!newDiscount) throw new Error();
        return res.status(201).json(newDiscount);
    } catch (error) {
        return res.status(500).json({ error: "Failed to create discount" });
    }
}

export const updateDiscount = async (req: Request, res: Response): Promise<Response<IDiscount | ErrorResponse>> => {
    try {
        const discountId = req.params.id;
        const { percentage, startDate, endDate } = req.body;
        if (!percentage || !startDate || !endDate) return res.status(400).json({ error: "Missing required fields" });
        if (new Date(startDate) >= new Date(endDate)) return res.status(400).json({ error: "Start date must be before end date" });
        const existingDiscount = await discountModel.findFirst({ 
            where: { 
                id: { not: discountId }, // exclude the current discount to avoid self-overlap
                percentage, 
                startDate: {lte: new Date(endDate)}, 
                endDate: {gte: new Date(startDate)} 
            }
        });
        if (existingDiscount) return res.status(400).json({ error: "Discount period overlaps with existing discount" });
        const updatedDiscount = await discountModel.update({
            where: { id: discountId },
            data: {
                percentage,
                startDate,
                endDate
            }
        });
        if (!updatedDiscount) throw new Error();
        return res.status(200).json(updatedDiscount);
    } catch (error) {
        return res.status(500).json({ error: "Failed to update discount" });
    }
}

export const deleteDiscount = async (req: Request, res: Response): Promise<Response<IDiscount | ErrorResponse>> => {
    try {
        const discountId = req.params.id;
        const deletedDiscount = await discountModel.delete({
            where: { id: discountId }
        });
        if (!deletedDiscount) throw new Error();
        return res.status(200).json(deletedDiscount);
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete discount" });
    }
}