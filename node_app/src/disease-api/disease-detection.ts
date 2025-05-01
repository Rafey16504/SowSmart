import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();
export const diseaseRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "/uploads");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

const LAMBDA_URL = process.env.DISEASEMODEL_URL || "";

diseaseRouter.post(
  "/detect-disease",
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: "No image uploaded" });
      return;
    }

    const imagePath = path.join(__dirname, "/uploads", req.file.filename);

    try {
      const imageBuffer = await readFileAsync(imagePath);
      const imageBase64 = imageBuffer.toString("base64");

      const lambdaResponse = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 }),
      });

      const text = await lambdaResponse.text();

      const result = JSON.parse(text);
      
      res.status(lambdaResponse.status).json(result);
    } catch (error) {
      res.status(500).json({ error: "Prediction failed" });
    } finally {
      await unlinkAsync(imagePath);
    }
  }
);
