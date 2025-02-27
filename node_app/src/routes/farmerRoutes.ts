import express from "express";
import { registerFarmer, getFarmers } from "../controllers/farmerController";

const router = express.Router();

router.post("/register-farmer", registerFarmer);
router.get("/farmers", getFarmers);

export default router;