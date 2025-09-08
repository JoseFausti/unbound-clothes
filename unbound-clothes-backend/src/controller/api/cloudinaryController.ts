import {v2 as cloudinary} from "cloudinary";
import { Request, Response } from "express";
import { extractPublicId, hashFile } from "../../utils/functions";

export const uploadCloudinaryController = async (req: Request, res: Response) => {
  try {
    // Verificamos si existe archivo
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Verificamos si el archivo no es muy grande (trailer y no más de 100MB)
    if (req.file.size > 100 * 1024 * 1024) {
      return res.status(400).json({ error: "File is too large" });
    }
    
    const hashedId = hashFile(req.file.buffer);
    // Verificamos si el archivo ya existe
    try {
      const existingFile = await cloudinary.api.resources({
        type: "upload",
        prefix: `unbound-clothes/uploads/${hashedId}`,
      });
      if (existingFile.resources.length) return res.status(400).json({ error: "File already exists" });
    } catch (error) {}

    // Subimos el archivo directamente desde memoria
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // detecta si es imagen o video
        folder: "unbound-clothes/uploads", // carpeta en tu cloudinary
        public_id: hashedId,
      },
      (error, uploadResult) => {
        if (error) return res.status(500).json({ error: "Error uploading file" });

        return res.status(200).json({
          url: uploadResult?.secure_url,
          size: uploadResult?.bytes, // tamaño en bytes
          duration: uploadResult?.duration, // segundos (solo para videos)
          width: uploadResult?.width,
          height: uploadResult?.height,
          format: uploadResult?.format,
          originalName: uploadResult?.original_filename,
          publicId: uploadResult?.public_id
        });
      }
    ); // WriteStream
    
    // Pasamos el buffer (memoryStorage()) del archivo a Cloudinary (enviamos los bytes del archivo)
    result.end(req.file.buffer);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCloudinaryController = async (req: Request, res: Response) => {
  try {
    const { imageUrl }: { imageUrl: string } = req.body;
    if (!imageUrl) return res.status(400).json({ error: "Image URL is required" });
    const publicId = extractPublicId(imageUrl);
    const { result } = await cloudinary.uploader.destroy(publicId);
    if (!result || result === "not found") return res.status(404).json({ error: "Image not found" });
    return res.status(200).json({ message: result });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}