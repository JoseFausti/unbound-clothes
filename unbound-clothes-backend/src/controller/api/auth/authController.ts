import { Request, Response } from "express";
import { ErrorResponse } from "../../../types/types";
import { userModel } from "../../../models/user/userModel";
import { IUser } from "../../../models/user/userModel.interface";
import { comparePassword, generateToken, hashPassword } from "../../../utils/functions";
import axios from "axios";
// Google OAuth
import { OAuth2Client } from "google-auth-library";
import { googleClientId } from "../../../config/config";
const client = new OAuth2Client(googleClientId)

export const login = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
        
        const user = await userModel.findUnique({ where: { email } });
        if (!user || user.deleted) return res.status(404).json({ error: "User not found" });
        
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

        const token = await generateToken({ 
            id: user.id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            role: user.role
         });
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ error: "Failed to login user" });
    }
}

export const register = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const { name, email, imageUrl, password } = req.body;
        
        if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });
        
        const user = await userModel.findUnique({ where: { email } });
        if (user) return res.status(409).json({ error: "User already exists" });

        const hashedPassword = await hashPassword(password);
        const newUser = await userModel.create({ data: { name, email, imageUrl, password: hashedPassword } });
        if (!newUser) throw new Error();

        const token = await generateToken({ 
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            imageUrl: newUser.imageUrl,
            role: newUser.role 
        });
        return res.status(201).json({ token });
    } catch (error) {
        return res.status(500).json({ error: "Failed to register user" });
    }
}

// Google OAuth Login
export const googleLogin = async (req: Request, res: Response): Promise<Response<IUser | ErrorResponse>> => {
    try {
        const { access_token } = req.body;
        if (!access_token) return res.status(400).json({ error: "Missing Google access token" });

        const googleRes = await axios.get<{ email: string | undefined}>(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const payload = googleRes.data;
        if (!payload?.email) return res.status(400).json({ error: "Invalid Google token" });

        const user = await userModel.findUnique({ where: { email: payload.email } });
        if (!user || user.deleted) return res.status(404).json({ error: "User not found" });

        const token = generateToken({
            id: user.id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            role: user.role
        });
        return res.status(200).json({ token });

    } catch (error) {
        return res.status(500).json({ error: "Failed to login user with Google" });
    }
}