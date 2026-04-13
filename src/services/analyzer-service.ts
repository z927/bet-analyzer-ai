import fs from "fs";
import path from "path";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { AnalyzerOutput } from "../types/common";

export const analyzeBet = async (
  buffer: Buffer,
  mimeType: string
): Promise<AnalyzerOutput> => {
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

    return extractJsonObject(text);
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

const extractJsonObject = (text: string): AnalyzerOutput => {
  const cleanedText = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");

  try {
    const parsedJson = JSON.parse(cleanedText) as AnalyzerOutput;

    if (!isAnalyzerOutput(parsedJson)) {
      throw new Error("Model returned an unexpected schema.");
    }

    return parsedJson;
  } catch {
    throw new Error("Model did not return valid JSON.");
  }
};

const isAnalyzerOutput = (data: unknown): data is AnalyzerOutput => {
  if (!data || typeof data !== "object") {
    return false;
  }

  const parsedData = data as AnalyzerOutput;

  return (
    typeof parsedData.bookmaker === "string" &&
    typeof parsedData.date === "string" &&
    typeof parsedData.stake === "string" &&
    typeof parsedData.potentialWin === "string" &&
    typeof parsedData.totalOdds === "string" &&
    typeof parsedData.status === "string" &&
    Array.isArray(parsedData.selections) &&
    parsedData.selections.every(
      (item) =>
        typeof item.event === "string" &&
        typeof item.selection === "string" &&
        typeof item.odds === "string" &&
        typeof item.result === "string"
    )
  );
};
