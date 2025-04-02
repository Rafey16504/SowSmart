const express = require("express");
import { Request, Response } from "express";
import pool from "../database/db";
export const farmerRegister = express.Router();

farmerRegister.post("/register-farmer", async (req: Request, res: Response) => {
    const { name, gender, dateOfBirth, phoneNumber, email } = req.body;

    try {
      const result = await pool.query(
        "INSERT INTO farmers_info (name, gender, dob, phone_number, email) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [name, gender, dateOfBirth, phoneNumber, email]
      );
  
      const { id: farmerId } = result.rows[0];
  
      res.status(201).json({ farmerId });
    } catch (error) {
      console.error("Database Insert Error:", error);
      res.status(500).json({ error: "Database error" });
    }
});