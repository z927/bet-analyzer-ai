import { Router, Request, Response } from "express";
import multer from "multer";
import { analyzeBet } from "../services/analyzer-service";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post(
  "/analize-bet",
  upload.single("bet"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "File mancante." });
      }

      analyzeBet("public", req.file.path, req.file.mimetype);

      return res.json({ success: true, message: "Schedina inviata!" });
    } catch (error) {
      console.error("Errore nel router:", error);
      return res.status(500).json({ error: "Errore interno." });
    }
  }
);

export default Router;
