const express = require("express");
import { Request, Response } from "express";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const upload = multer({ dest: "/uploads" });
export const aiModel = express.Router();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:process.env.OPENAI_APIKEY,
  defaultHeaders: {
    "HTTP-Referer": "https://sowsmart.com",
    "X-Title": "SowSmart",
  },
});

aiModel.post(
  "/ask-ai",
  upload.single("image"),
  async (req: Request, res: Response) => {
    const isMultipart = req.is("multipart/form-data");
    const message = isMultipart ? req.body.message : req.body.message;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    try {
      const messages: any[] = [
        {
          role: "system",
          content:
            "Always respond in markdown format and ADD EMOJIS as well. Only answer plant-related questions like diseases. Process any image you get as well. And ensure everything is in English.",
        },
        { role: "user", content: message },
      ];

      if (req.file) {
        const imagePath = path.resolve(req.file.path);
        const base64Image = fs.readFileSync(imagePath).toString("base64");
        const imageMIME = req.file.mimetype;

        messages.push({
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${imageMIME};base64,${base64Image}`,
              },
            },
          ],
        });

        fs.unlinkSync(imagePath);
      }

      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-4-maverick:free",
        messages,
        max_tokens: 2000,
      });
      const reply = completion.choices?.[0]?.message?.content;
      if (!reply) {
        return res.status(500).json({ error: "No reply from AI model." });
      }

      res.json({ reply });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Something went wrong with AI processing." });
    }
  }
);
