import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { functions } from "./tools.js";

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const messages = [
  {
    role: "system",
    content: `
You are an intelligent AI assistant.

Your behavior:
- Remember user information shared during conversation
- Be conversational and natural
- Refer back to earlier context when relevant
- Avoid acting forgetful
- Keep responses concise but smart
- If user shares their name, remember it
- If user shares interests/projects, remember them

Always format responses using markdown.

Use:
- headings
- bullets
- numbering
- spacing
- code blocks

Avoid giant paragraphs.
`,
  },
];

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    messages.push({
      role: "user",
      content: message,
    });

    res.setHeader(
      "Content-Type",
      "text/plain; charset=utf-8"
    );

    res.setHeader(
      "Transfer-Encoding",
      "chunked"
    );

    const stream =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        stream: true,

        messages,
      });

    let fullReply = "";

    for await (const chunk of stream) {
      const content =
        chunk.choices[0]?.delta?.content || "";

      fullReply += content;

      res.write(content);
    }

    messages.push({
      role: "assistant",
      content: fullReply,
    });

    res.end();
  } catch (err) {
    console.error(err);

    res.status(500).end("Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
