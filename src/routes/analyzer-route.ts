import { Router, Request, Response } from "express";
import { analyzeBet } from "../services/analyzer-service";
import multer from "multer";
import "dotenv/config";

const upload = multer({ dest: "uploads/" });
const analyzeRouter = Router();

analyzeRouter.post(
  "/analyze-bet",
  upload.single("bet"),
  async (req: Request, res: Response) => {
    try {
      console.log("Received file: ", req.file);
      if (!req.file) {
        return res.status(400).json({ error: "File mancante." });
      }

      await analyzeBet("public", req.file.path, req.file.mimetype);

      return res.status(200).json({ success: true, message: "Bet Analyzed!" });
    } catch (error) {
      console.error("Errore nel router: ", error);
      return res.status(500).json({ error: "Errore interno." });
    }
  }
);

export default analyzeRouter;
