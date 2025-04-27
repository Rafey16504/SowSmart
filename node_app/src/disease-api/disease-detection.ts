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

    const cleanup = () => {
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete temp image:", unlinkErr);
        }
      });
    };

    try {
      execFile("python3", [pythonScript, imagePath], (err, stdout, stderr) => {
        if (err) {
          console.error("Error running Python script:", err);
          console.error("Python stderr:", stderr);
          cleanup();
          res.status(500).json({ error: "Disease detection failed (Python error)" });
          return;
        }

        if (stderr) {
          console.error("Python stderr output:", stderr);
          // still continue unless fatal
        }

        try {
          const result = JSON.parse(stdout);
          res.json(result);
        } catch (parseError) {
          console.error("Failed to parse Python output:", parseError);
          console.error("Raw output:", stdout);
          res.status(500).json({ error: "Invalid model output format" });
        } finally {
          cleanup();
        }
      });
    } catch (outerError) {
      console.error("Unexpected error:", outerError);
      cleanup();
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
