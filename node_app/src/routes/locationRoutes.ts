import express from "express";
import { registerLocation } from "../controllers/locationController";

const router = express.Router();

router.post("/register-location", registerLocation);

export default router;
