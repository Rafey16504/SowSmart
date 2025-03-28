import express from "express";
import { registerFarmer, getFarmer } from "../controllers/farmerController";

const router = express.Router();

router.post("/register-farmer", registerFarmer);
router.post("/get-farmer", getFarmer);

export default router;
