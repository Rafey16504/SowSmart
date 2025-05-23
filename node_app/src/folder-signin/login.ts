const express = require("express");
import { Request, Response } from "express";
import pool from "../database/db";
import bcrypt from "bcrypt";

export const loginFarmer = express.Router();

loginFarmer.post("/login-farmer", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({
        success: false,
        error: "Email and password are required",
      });
    }

    const result = await pool.query(
      "SELECT id, password FROM farmer WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false, error: "Email not found" });
    }

    const { id, password: hashedPassword } = result.rows[0];

    if (!hashedPassword) {
      return res.json({ success: false, error: "Stored password is missing." });
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return res.json({ success: false, error: "Invalid password" });
    }

    res.status(200).json({ success: true, farmerId: id });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});
