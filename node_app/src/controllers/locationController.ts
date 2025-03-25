import { Request, Response } from "express";
import pool from "../config/db";

export const registerLocation = async (req: Request, res: Response) => {
  const { farmer_id, province, city, district } = req.body;

  console.log("Adding Location for Farmer ID:", farmer_id);

  try {
    const result = await pool.query(
      "UPDATE farmers_info SET province = $1, city = $2, district = $3 WHERE id = $4 RETURNING *",
      [province, city, district, farmer_id]
    );

    console.log("Location Updated:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Database Insert Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
