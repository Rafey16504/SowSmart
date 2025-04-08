const express = require("express");
import { Request, Response } from "express";
import pool from "../database/db";
export const cropRecommend = express.Router();

cropRecommend.post("/crop-recommendation", async (req: Request, res: Response) => {
    const { soilType, temperature, humidity, rainfall, ph } = req.body;
  
    console.log("Received for crop recommendation:", {
      soilType,
      temperature,
      humidity,
      rainfall,
      ph,
    }); // ye hata dena baad mai
    
    let recommendedCrop = "Maize"; // replace with ML model or logic later
  
  
    res.json({ recommendation: recommendedCrop });
  });
  