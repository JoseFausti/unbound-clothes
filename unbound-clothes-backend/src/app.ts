import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import {portConfig} from "./config/config";
import apiRouter from "./routes/apiRouter";
import { authRouter } from "./routes/api/auth/authRouter";
import { authMiddleware } from "./middleware/middleware";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL })); // Enable CORS for the frontend URL
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use("/api", authMiddleware, apiRouter); // Main API routes
app.use("/api/auth", authRouter); // Authentication routes

export default app;
