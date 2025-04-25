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
import { diseaseRouter } from "./disease-api/disease_detection";
import { cropInsightsRouter } from "./crop-insights/crop-insights";

const app = express();
const port = 8000;

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


app.listen(port, () => {
  console.log(`SowSmart backend running at: http://localhost:${port}`);
});
