import { jwtConfig, portConfig } from "../config/config";

// Response types
export type ErrorResponse = { error: string };

// Config types
export type PortConfig = typeof portConfig;
export type JwtConfig = typeof jwtConfig;

// Type for Drive files
export type FilmType = "movie" | "series" | "documentaries";