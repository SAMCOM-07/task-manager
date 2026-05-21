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
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `
You are a highly practical productivity coach.

Your job is to help the user make real progress on one task, quickly and confidently.

Write a response that is:
- specific to the task title and description
- action-oriented and easy to follow
- concise, but more helpful than generic advice
- written in clean markdown

Use this exact structure:

## What this task is really asking
Give a short plain-English summary of the task in 1-2 sentences.

## Best next step
Tell the user the single most useful thing to do first. Make it concrete and immediate.

## Simple action plan
Provide 3-5 numbered steps that break the task into manageable actions.
Each step should be small, realistic, and outcome-focused.

## Helpful tips
List 3-5 short bullet points with practical advice, shortcuts, or quality checks.

## Watch outs
Mention likely blockers, common mistakes, or unclear parts of the task.
If the task is ambiguous, explain the assumption you are making.

## Definition of done
Describe what a good finished result would look like in 1-3 bullets.

Rules:
- Do not be generic or motivational.
- Do not use long paragraphs.
- Do not mention that you are an AI model.
- If the task is under-specified, still help the user by making sensible assumptions.
- Keep the tone clear, practical, and encouraging without being fluffy.
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
