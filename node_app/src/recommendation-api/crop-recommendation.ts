const express = require("express");
import { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";

export const cropRecommend = express.Router();

cropRecommend.post(
  "/crop-recommendation",
  async (req: Request, res: Response) => {
    const { ph, temperature, humidity, rainfall } = req.body;

    const args = [ph, temperature, humidity, rainfall].map(String);
    const scriptPath = path.join(__dirname, "crop_recommendation_model.py");
    const python = spawn("python3", [scriptPath, ...args]);

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({
          error: "Python script failed",
          stderr: errorOutput,
        });
      }

      try {
        const result = JSON.parse(output);
        res.json({ recommendation: result });
      } catch (err) {
        res.status(500).json({
          error: "Failed to parse Python output",
          rawOutput: output,
        });
      }
    });
  }
);
