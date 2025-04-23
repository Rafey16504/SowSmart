import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { execFile } from "child_process";
import fs from "fs";

export const diseaseRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../../uploads");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

diseaseRouter.post("/detect-disease", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No image uploaded" });
    return;
  }

  const imagePath = path.join(__dirname, "../../../uploads", req.file.filename);
  const pythonScript = path.join(__dirname, "model_runner.py");

  execFile("python", [pythonScript, imagePath], (err, stdout, stderr) => {
    if (err) {
      console.error("Python error:", stderr || err);
      res.status(500).json({ error: "Model processing failed" });
      return;
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      res.status(500).json({ error: "Invalid model output" });
    }
  });
});

