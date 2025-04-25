const express = require("express");
import { Request, Response } from "express";
const nodemailer = require("nodemailer");
import pool from "../database/db";
import crypto from "crypto";
import bcrypt from "bcrypt";
export const resetPass = express.Router();

const verificationCodes = new Map<string, string>();

resetPass.post("/send-reset-code", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const user = await pool.query(
      "SELECT * FROM farmer WHERE email = $1",
      [email]
    );

    if (user.rowCount === 0) {
      return res.status(404).json({ error: "Email not found." });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    verificationCodes.set(email, code);

    await sendEmail(email, code);

    res.json({ success: true, message: "Verification code sent." });
  } catch (err) {
    res.status(500).json({
      error:
        "Failed to send verification code. Please ensure the email is correct!",
    });
  }
});

async function sendEmail(emailAddress: string, code: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sowsmartss@gmail.com",
      pass: "xmyw pbqz rome jema",
    },
  });

  const htmlContent = `
  <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05); color: #333;">
    <h2 style="color: #2e7d32; text-align: center;">🔐 SowSmart Password Reset</h2>
    <p style="font-size: 16px;">Hello,</p>
    <p style="font-size: 16px;">We received a request to reset your password for your SowSmart account.</p>
    <p style="font-size: 16px;">Please use the verification code below to reset your password:</p>
    <div style="margin: 30px auto; text-align: center;">
      <span style="display: inline-block; background-color: #e8f5e9; color: #1b5e20; font-size: 28px; font-weight: bold; padding: 15px 25px; border-radius: 8px; letter-spacing: 2px;">
        ${code}
      </span>
    </div>
    <p style="font-size: 16px;">If you did not request a password reset, you can safely ignore this email.</p>
    <br />
    <p style="font-size: 14px; color: #777;">Thank you,<br />The SowSmart Team</p>
  </div>
`;

  const emailConfig = {
    from: "SowSmart <sowsmartss@gmail.com>",
    to: emailAddress,
    subject: "SowSmart Password Reset Code",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(emailConfig);
  } catch (error) {
    throw new Error(`Error sending email: ${error}`);
  }
}

resetPass.post("/reset-password", async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const storedCode = verificationCodes.get(email);

  if (!storedCode || storedCode !== code) {
    return res
      .status(400)
      .json({ error: "Invalid or expired verification code." });
  }

  try {
    const result = await pool.query(
      "SELECT password FROM farmer WHERE email = $1",
      [email]
    );

    const oldPassword = result.rows[0].password;
    const isSamePassword = await bcrypt.compare(newPassword, oldPassword);

    if (isSamePassword) {
      return res.status(200).json({
        success: false,
        message: "New password must be different from the old password.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE farmer SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);

    verificationCodes.delete(email);

    res.json({ success: true, message: "Password has been reset." });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset password." });
  }
});
