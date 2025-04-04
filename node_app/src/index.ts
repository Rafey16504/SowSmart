import express from "express";
import bodyParser from "body-parser";
import { getFarmer } from "./farmer-signup/check-existing";
import { farmerRegister } from "./farmer-signup/farmer-register";
import { farmerLocation } from "./farmer-signup/farmer-location";
import { verifyEmail } from "./farmer-signup/send-email";
import cors from "cors";

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/", getFarmer);
app.use("/", farmerRegister);
app.use("/", farmerLocation);
app.use("/", verifyEmail);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
