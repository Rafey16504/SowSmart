const express = require("express");
import { Request, Response } from "express";
import OpenAI from 'openai';

export const aiModel = express.Router();

interface AskAIRequestBody {
  message: string;
}
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': 'https://sowsmart.com',
    'X-Title': 'SowSmart',
  },
});


aiModel.post("/ask-ai", async (req: Request<{}, {}, AskAIRequestBody>, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: 'Always respond in markdown format and add emojis as well.' },
        { role: 'user', content: message }
      ],
      max_tokens: 2000,
    });
    
  
    if (
      !completion ||
      !completion.choices ||
      completion.choices.length === 0 ||
      !completion.choices[0].message
    ) {
      console.error('Unexpected response from OpenAI:', completion);
      return res.status(500).json({ error: 'No response from AI model.' });
    }
  
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Something went wrong with AI processing.' });
  }
  
});

