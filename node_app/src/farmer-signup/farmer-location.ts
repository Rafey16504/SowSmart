const express = require("express");
import { Request, Response } from "express";
import pool from "../database/db";
export const farmerLocation = express.Router();

farmerLocation.post(
  "/register-location",
  async (req: Request, res: Response) => {
    const { farmerId, province, city, district } = req.body;

    try {
      const result = await pool.query(
        "UPDATE farmer SET province = $1, city = $2, district = $3 WHERE id = $4 RETURNING *",
        [province, city, district, farmerId]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Could not update farmer location." });
    }
  }
);
