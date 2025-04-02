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
    console.error("Error sending email:", error);
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
  
    const emailConfig = {
      from: "sowsmartss@gmail.com",
      to: emailAddress,
      subject: "Verification Code",
      text: verificationCode,
    };
  
    try {
      await transporter.sendMail(emailConfig);
    } catch (error) {
      throw new Error(`Error sending email: ${error}`);
    }
  }