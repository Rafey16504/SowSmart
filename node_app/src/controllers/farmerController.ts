import { Request, Response } from "express";
import pool from "../config/db";

export const registerFarmer = async (req: Request, res: Response) => {
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
};

export const getFarmer = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      "SELECT id FROM farmers_info WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ error: "Not Registered!" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};
