import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { loginFarmer } from "./folder-signin/login";
import { farmerRegister } from "./farmer-signup/farmer-register";
import { farmerLocation } from "./farmer-signup/farmer-location";
import { verifyEmail } from "./farmer-signup/send-email";
import { locationRouter } from "./location-api/location";
import { weatherRouter } from "./weather-api/openweather";
import { cropRecommend } from "./recommendation-api/crop-recommendation";
import { getFarmer } from "./farmer-signup/check-existing";
import { aiModel } from "./ai-chatbot/open-ai";
import { diseaseRouter } from "./disease-api/disease-detection";
import { cropInsightsRouter } from "./crop-insights/crop-insights";
import { resetPass } from "./folder-signin/forget-pass";
import downloadModelIfNeeded from "./model-download/download-model";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

import fs from "fs";
import path from "path";

app.get("/list-files", (req, res) => {
  const rootDirectoryPath = path.resolve("./");
  const modelDirectoryPath = path.resolve("./model");

  function walk(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      return `Directory ${dirPath} does not exist.`;
    }
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    return files.map(file => {
      const fullPath = path.join(dirPath, file.name);
      const sizeInMB = !file.isDirectory()
        ? (fs.statSync(fullPath).size / (1024 * 1024)).toFixed(2)
        : null;
      return {
        name: file.name,
        isDirectory: file.isDirectory(),
        sizeMB: sizeInMB,
      };
    });
  }

  const rootFiles = walk(rootDirectoryPath);
  const modelFiles = walk(modelDirectoryPath);

  res.json({
    root: rootFiles,
    modelFolder: modelFiles
  });
});

app.get("/model-status", (req:any, res:any) => {
  const modelPath = path.resolve(__dirname, "../../model/plant_disease_prediction_model.h5");

  if (!fs.existsSync(modelPath)) {
    return res.status(404).json({ status: "Model file not found." });
  }

  const stats = fs.statSync(modelPath);

  res.json({
    status: "Model file exists.",
    sizeInMB: (stats.size / (1024 * 1024)).toFixed(2) + " MB",
    lastModified: stats.mtime.toISOString(),
  });
});

async function startServer() {
  await downloadModelIfNeeded();

  app.use("/", loginFarmer);
  app.use("/", getFarmer);
  app.use("/", farmerRegister);
  app.use("/", farmerLocation);
  app.use("/", verifyEmail);
  app.use("/", locationRouter);
  app.use("/", weatherRouter);
  app.use("/", cropRecommend);
  app.use("/", aiModel);
  app.use("/", diseaseRouter);
  app.use("/", cropInsightsRouter);
  app.use("/", resetPass);

  app.listen(port, () => {
    console.log(`SowSmart backend running at port: ${port}`);
  });
}

startServer();
