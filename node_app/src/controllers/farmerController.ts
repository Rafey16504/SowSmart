import { Request, Response } from "express";
import pool from "../config/db";

export const registerFarmer = async (req: Request, res: Response) => {
  const { name, gender, dob, phone_number } = req.body;

  console.log("Received Data from Frontend:", req.body); 

  try {
    const result = await pool.query(
      "INSERT INTO farmers_info (name, gender, dob, phone_number) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, gender, dob, phone_number]
    );

    const farmerId = result.rows[0].id; 
    console.log("Farmer Registered with ID:", farmerId);

    res.status(201).json({ farmerId }); 
  } catch (error: any) {
    console.error("Database Insert Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};


export const getFarmers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM farmers_info");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};