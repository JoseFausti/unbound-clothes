import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from "cloudinary";
import {MercadoPagoConfig, Preference, Payment} from "mercadopago";
dotenv.config();

// Port configuration
export const portConfig = {
    port: process.env.PORT || 3002,
    db: {
        url: process.env.DATABASE_URL
    },
    frontendUrl: process.env.FRONTEND_URL,
    certs: {
        key: fs.readFileSync(path.join(__dirname, "../../key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "../../cert.pem"))
    }
}

// JWT configuration
export const jwtConfig = {
    jwtSecret: process.env.JWT_SECRET
}

// Cloudinary configuration
export const cloudinaryConfig = 
    // Configuración de Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    }
);

// MercadoPago configuration
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!
})
export const mpPreference = new Preference(client);
export const mpPayment = new Payment(client);