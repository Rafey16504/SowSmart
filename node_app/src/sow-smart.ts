const express = require('express');
const multer  = require('multer');
import path from 'path'
import { v4 as uuidv4 } from "uuid";
import { ZodError } from "zod";
import { convertToReadableError } from "./zod-mapping";

const nodemailer = require("nodemailer");
export const appRouter = express.Router();

function sendEmail(email: any, code: any) {
    return new Promise((resolve: any, reject: any) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sowsmartss@gmail.com",
          pass: "xmyw pbqz rome jema",
        },
      });
      const mail_configs = {
        from: "sowsmartss@gmail.com",
        to: email,
        subject: "Verification Code",
        text: `${code}`,
      };
      transporter.sendMail(mail_configs, (error: any, info: any) => {
        if (error) {
          console.error("Error sending email:", error);
          return reject({ message: `An error has occurred: ${error.message}` });
        }
        console.log("Email sent:", info);
        return resolve({ message: `Email sent successfully` });
      });
    });
  }
  
  appRouter.post("/send-email/:id", async (req: any, res: any) => {
    const { email } = req.body;
    const id = req.params.id;
    const verification_code:any = {};
    verification_code[id] = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    
    try {
      await sendEmail(email, verification_code[id]);
      
      return res.send({ message: verification_code[id] });
    } catch (error) {
      
      console.error('Error sending email:', error);
      return res.status(500).send('Could not send email!');
    } 
  });
