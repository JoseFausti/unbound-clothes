import express from "express";
import { createDirection, deleteDirection, getAllDirections, getDirectionById, restoreDirection, updateDirection } from "../../controller/api/directionsController";

export const directionsRouter = express.Router();

directionsRouter.get("/", getAllDirections);
directionsRouter.get("/:id", getDirectionById);
directionsRouter.post("/", createDirection);
directionsRouter.put("/:id", updateDirection);
directionsRouter.delete("/:id", deleteDirection);
directionsRouter.put("/:id/restore", restoreDirection);
