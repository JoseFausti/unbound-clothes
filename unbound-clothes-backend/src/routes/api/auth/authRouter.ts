import express from "express";
import { login, register } from "../../../controller/api/auth/authController";

export const authRouter = express.Router();

// CRUD Authentication
authRouter.post("/login", login);
authRouter.post("/register", register);