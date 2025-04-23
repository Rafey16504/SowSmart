import express from "express";
import bodyParser from "body-parser";
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
import cors from "cors";

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
