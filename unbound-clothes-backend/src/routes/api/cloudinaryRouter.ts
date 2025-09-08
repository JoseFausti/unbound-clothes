import express from "express";
import multer from "multer";
import { deleteCloudinaryController, uploadCloudinaryController } from "../../controller/api/cloudinaryController";
import { isAdminMiddleware } from "../../middleware/middleware";

export const uploadCloudinaryRouter = express.Router();

// Usamos almacenamiento en memoria para evitar carpeta física
const storage = multer.memoryStorage();
const upload = multer({ storage });

uploadCloudinaryRouter.post("/", upload.single("file"), isAdminMiddleware, uploadCloudinaryController);
uploadCloudinaryRouter.delete("/", isAdminMiddleware, deleteCloudinaryController);

