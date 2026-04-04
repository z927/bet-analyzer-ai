import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileToGenerativePart } from "../utils/file-utils";
import { sendMessage } from "./telegram-service";
import { ChannelType } from "../types/common";

export const analyzeBet = async (
  channelType: ChannelType,
  filePath: string,
  mimeType: string
) => {
  try {
    // 1. Model setup
    const model: GenerativeModel = genAI.getGenerativeModel({
      model: process.env.AI_MODEL_TYPE,
    });

    // 2. Data Prep for AI
    const prompt = getPrompt();
    const imagePart = fileToGenerativePart(filePath, mimeType);

    // 3. Api Call
    const result = await model.generateContent([prompt ?? "", imagePart]);
    const response = result.response;
    const text = response.text();

    // 4. Send to Telegram
    await sendMessage(channelType, text);

    // 5. Cleanup
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Errore during analysis: ", error);
  }
};

const getPrompt = (): string | undefined => {
  try {
    const PROMPT_PATH = path.join(__dirname, "prompts", "bet_instructions.md");

    if (fs.existsSync(PROMPT_PATH)) {
      return fs.readFileSync(PROMPT_PATH, "utf-8");
    }
  } catch (e) {
    console.error("Errore reading prompt:", e);
    throw new Error("Prompt file not found or unreadable.");
  }
};
