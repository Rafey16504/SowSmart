import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { execFile } from "child_process";
import fs from "fs";

export const diseaseRouter = express.Router();

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
    const pythonScript = path.join(__dirname, "disease_model_runner.py");

    execFile("python", [pythonScript, imagePath], (err, stdout, stderr) => {
      const cleanup = () => {
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
          }
        });
      };

      if (err) {
        cleanup();
        res.status(500).json({ error: "Model processing failed" });
        return;
      }

      try {
        const result = JSON.parse(stdout);
        res.json(result);
      } catch (parseError) {
        res.status(500).json({ error: "Invalid model output" });
      } finally {
        cleanup();
      }
    });
  }
);
