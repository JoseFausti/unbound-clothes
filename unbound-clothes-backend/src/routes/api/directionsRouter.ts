import express from "express";
import { createDirection, deleteDirection, getAllDirections, getDirectionById, restoreDirection, updateDirection } from "../../controller/api/directionsController";
import { isAdminMiddleware } from "../../middleware/middleware";

export const directionsRouter = express.Router();

directionsRouter.get("/", getAllDirections);
directionsRouter.get("/:id", getDirectionById);
directionsRouter.post("/", isAdminMiddleware, createDirection);
directionsRouter.put("/:id", isAdminMiddleware, updateDirection);
directionsRouter.delete("/:id", isAdminMiddleware, deleteDirection);
directionsRouter.put("/:id/restore", isAdminMiddleware, restoreDirection);
