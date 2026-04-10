import fs from "fs";
import path from "path";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

export const analyzeBet = async (buffer: Buffer, mimeType: string) => {
  try {
    console.log(process.env.AI_API_KEY);
    const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || "");

    // 1. Model setup
    const model: GenerativeModel = genAI.getGenerativeModel({
      model: process.env.AI_MODEL_TYPE ?? "",
    });

    // 2. Data Prep for AI
    const prompt = getPrompt();

    const imagePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: mimeType,
      },
    };

    // 3. Api Call
    const result = await model.generateContent([prompt ?? "", imagePart]);
    const response = result.response;
    const text = response.text();
    console.log("AI Response: ", text);

    return text;
  } catch (error) {
    console.error("Errore during analysis: ", error);
    throw new Error("Failed to analyze bet.");
  }
};

const getPrompt = (): string | null => {
  try {
    const PROMPT_PATH = path.join(
      __dirname,
      "..",
      "resources",
      "prompts",
      "bet_instructions.md"
    );

    if (fs.existsSync(PROMPT_PATH)) {
      return fs.readFileSync(PROMPT_PATH, "utf-8");
    }
    return null;
  } catch (e) {
    console.error("Errore reading prompt: ", e);
    throw new Error("Prompt file not found or unreadable.");
  }
};
