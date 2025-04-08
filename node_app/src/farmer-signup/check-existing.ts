const express = require("express");
import { Request, Response } from "express";
import pool from "../database/db";
export const getFarmer = express.Router();

getFarmer.post("/get-farmer", async (req: Request, res: Response) => {
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
});