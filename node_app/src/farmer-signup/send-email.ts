const express = require("express");
import { Request, Response } from "express";
const nodemailer = require("nodemailer");
export const verifyEmail = express.Router();

verifyEmail.post("/send-email", async (req: Request, res: Response) => {
  const { email } = req.body;
  const verification_code: string = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    await sendEmail(email, verification_code);

    return res.send({ message: verification_code });
  } catch (error) {
    return res.status(500).send("Could not send email!");
  }
});

async function sendEmail(
  emailAddress: string,
  verificationCode: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sowsmartss@gmail.com",
      pass: "xmyw pbqz rome jema",
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4fff6; border-radius: 10px;">
      <h2 style="color: #2e7d32;">🌿 Welcome to SowSmart!</h2>
      <p style="font-size: 16px; color: #333;">Thank you for signing up. To complete your registration, please verify your email address by entering the following code:</p>
      <div style="margin: 20px 0; text-align: center;">
        <span style="display: inline-block; padding: 15px 30px; background-color: #2e7d32; color: #fff; font-size: 24px; font-weight: bold; border-radius: 8px;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 14px; color: #555;">If you did not create a SowSmart account, please ignore this email.</p>
      <br />
      <p style="font-size: 14px; color: #777;">— The SowSmart Team</p>
    </div>
  `;

  const emailConfig = {
    from: "SowSmart <sowsmartss@gmail.com>",
    to: emailAddress,
    subject: "SowSmart Email Verification Code",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(emailConfig);
  } catch (error) {
    throw new Error(`Error sending email: ${error}`);
  }
}
