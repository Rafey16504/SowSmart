import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();
export const diseaseRouter = express.Router();

AWS.config.update({
  region: "ap-southeast-2",
  accessKeyId: process.env.AWS_ACCESSSKEY,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
});

const sagemaker = new AWS.SageMakerRuntime();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "/");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

diseaseRouter.post(
  "/detect-disease",
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: "No image uploaded" });
      return;
    }

    const imagePath = path.join(__dirname, "/", req.file.filename);
    const imageBuffer = fs.readFileSync(imagePath);

    const endpointName = "your-endpoint-name";
    const params = {
      EndpointName: endpointName,
      Body: imageBuffer,
      ContentType: "image/jpeg",
      Accept: "application/json",
    };

    try {
      const data = await sagemaker.invokeEndpoint(params).promise();
      
      const result = JSON.parse(data.Body.toString("utf-8"));
      res.json(result);

      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting uploaded image:", unlinkErr);
        }
      });
    } catch (err) {
      console.error("Error invoking SageMaker endpoint:", err);
      res.status(500).json({ error: "Model processing failed" });
    }
  }
);
