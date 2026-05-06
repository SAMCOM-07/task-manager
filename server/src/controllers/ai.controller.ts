import OpenAI from "openai";
import { Request, Response } from "express";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export const getTaskAIHelp = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a smart productivity assistant.

Your job is to help users complete tasks efficiently.

Always respond in this structured format:

1. Brief overview (1-2 sentences)
2. Step-by-step guide (clear numbered steps)
3. Tips (short bullet points)
4. Possible challenges (optional)

Keep it simple, practical, and actionable.
Avoid long paragraphs.
      `,
        },
        {
          role: "user",
          content: `
Task Title: ${title}
Task Description: ${description}
      `,
        },
      ],
    });

    const reply =
      completion.choices[0].message?.content || "Sorry, I couldn't get that.";

    res.json({ response: reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed" });
  }
};
