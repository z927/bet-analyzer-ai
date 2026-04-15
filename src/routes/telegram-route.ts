import { Router, Request, Response } from "express";
import { sendTelegramChannelMessage } from "../services/telegram-service";
import { AnalyzerOutput, ChannelType } from "../types/common";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const telegramRouter = Router();

telegramRouter.post(
  "/send-message",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Immagine mancante" });
      }

      if (!req.body.data) {
        return res
          .status(400)
          .json({ error: "Dati JSON (campo 'data') mancanti" });
      }

      console.log(req.body.data);

      let betData: AnalyzerOutput;

      try {
        betData = JSON.parse(req.body.data);
      } catch (error) {
        return res
          .status(400)
          .json({ error: "Formato JSON nel campo 'data' non valido" });
      }

      console.log("Bookmaker: ", betData.bookmaker);
      console.log("Numero selezioni: ", betData.selections.length);

      await sendTelegramChannelMessage(
        req.query.channel as ChannelType,
        betData,
        req.file.buffer
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Errore interno" });
    }
  }
);

export default telegramRouter;
