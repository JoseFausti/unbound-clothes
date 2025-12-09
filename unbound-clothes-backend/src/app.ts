import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import apiRouter from "./routes/apiRouter";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL })); // Enable CORS for the frontend URL
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use("/api", apiRouter); // Main API routes

export default app;
