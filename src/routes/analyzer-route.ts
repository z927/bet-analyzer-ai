import { Router, Request, Response } from "express";
import { analyzeBet } from "../services/analyzer-service";
import { AnalyzerOutput } from "../types/common";
import { isTelegramValidationError } from "../utils/validator";
import multer from "multer";
import "dotenv/config";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const analyzeRouter = Router();

analyzeRouter.post(
  "/bet",
  upload.single("bet"),
  async (req: Request, res: Response<AnalyzerOutput | { error: string }>) => {
    try {
      console.log("Received file: ", req.file);

      if (!req.file) {
        return res.status(400).json({ error: "Missing File." });
      }

      const analysis = await analyzeBet(req.file.buffer, req.file.mimetype);

      return res.status(200).json(analysis);
    } catch (error) {
      if (isTelegramValidationError(error)) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      console.error("Errore nel router: ", error);
      return res.status(500).json({ error: "Generic Error." });
    }
  }
);

export default analyzeRouter;
