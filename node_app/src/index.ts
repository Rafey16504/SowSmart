import express from "express";
import bodyParser from "body-parser";
import { appRouter } from "./sow-smart";
import farmerRoutes from "./routes/farmerRoutes";
import locationRoutes from "./routes/locationRoutes";
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

app.use("/", appRouter);
app.use("/api", farmerRoutes);
app.use("/api", locationRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
