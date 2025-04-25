import express from "express";
import { Request, Response } from "express";
import pool from "../database/db";
import bcrypt from "bcrypt";

export const farmerRegister = express.Router();

farmerRegister.post("/register-farmer", async (req: Request, res: Response) => {
  const {
    name,
    gender,
    dateOfBirth,
    phoneNumber,
    email,
    password,
    province,
    city,
    district,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO farmers_info 
        (name, gender, dob, phone_number, email, password, province, city, district) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        name,
        gender,
        dateOfBirth,
        phoneNumber,
        email,
        hashedPassword,
        province,
        city,
        district,
      ]
    );

    const { id: farmerId } = result.rows[0];

    res.status(201).json({ success: true, farmerId });
  } catch (error) {
    res.status(500).json({ error: "Registration failed." });
  }
});
