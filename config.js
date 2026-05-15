import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

/** OpenRouter + OpenAI SDK config */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

/** Supabase config */
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY,
);
