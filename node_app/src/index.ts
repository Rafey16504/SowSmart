import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

// Route imports
import { loginFarmer } from "./folder-signin/login";
import { farmerRegister } from "./farmer-signup/farmer-register";
import { farmerLocation } from "./farmer-signup/farmer-location";
import { verifyEmail } from "./farmer-signup/send-email";
import { locationRouter } from "./location-api/location";
import { weatherRouter } from "./weather-api/openweather";
import { cropRecommend } from "./recommendation-api/crop-recommendation";
import { getFarmer } from "./farmer-signup/check-existing";
import { aiModel } from "./ai-chatbot/open-ai";
import { diseaseRouter } from "./disease-api/disease_detection";
import { smartRecommend } from "./recommendation-api/smart-recommendation";
import { cropInsightsRouter } from "./recommendation-api/crop-insights";

const app = express();
const port = 8000;

// === Middleware Setup ===
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Optional manual CORS headers (can be skipped if using `cors()` above)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

// === Register All Routes ===
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
app.use("/", smartRecommend);
app.use("/", cropInsightsRouter);

// === Server Boot ===
app.listen(port, () => {
  console.log(`🌿 SowSmart backend running at: http://localhost:${port}`);
});
