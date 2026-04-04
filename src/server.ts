import express, { Request, Response } from "express";
import multer from "multer";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";

const app = express();
const upload = multer({ dest: "uploads/" });

// --- CONFIGURAZIONE ---
const GEMINI_API_KEY: string = "IL_TUO_API_KEY_GEMINI";
const TELEGRAM_TOKEN: string = "IL_TUO_BOT_TOKEN_TELEGRAM";
const TELEGRAM_CHANNEL_ID: string | number = "@il_tuo_canale";

// Inizializzazione API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

/**
 * Interfaccia per la parte generativa dell'immagine
 */
interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

/**
 * Converte il file locale in un oggetto compatibile con Gemini
 */
function fileToGenerativePart(
  filePath: string,
  mimeType: string
): GenerativePart {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType,
    },
  };
}

/**
 * Endpoint principale per caricare la schedina
 */
app.post(
  "/analizza-schedina",
  upload.single("schedina"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "Nessun file caricato." });
        return;
      }

      // 1. Configurazione Modello Gemini 2.5 Flash
      const model: GenerativeModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-preview-09-2025",
      });

      const prompt: string = `
      Analizza questa immagine di una schedina di calcio. 
      Estrai le seguenti informazioni:
      - Eventi (Squadra Casa vs Squadra Fuori)
      - Pronostico (es. 1, X, 2, Goal, Over)
      - Quota associata
      - Moltiplicatore totale (se presente)
      - Importo giocato (se presente)
      - Vincita potenziale (se presente)
      
      Formatta il risultato come un messaggio pronto per Telegram, usando emoji e grassetto per renderlo accattivante.
    `;

      const imagePart: GenerativePart = fileToGenerativePart(
        req.file.path,
        req.file.mimetype
      );

      // 2. Chiamata a Gemini
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text: string = response.text();

      // 3. Invio a Telegram
      await bot.sendMessage(TELEGRAM_CHANNEL_ID, text, {
        parse_mode: "Markdown",
      });

      // Pulizia file temporaneo
      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        message: "Schedina analizzata e inviata al canale!",
        analisi: text,
      });
    } catch (error) {
      console.error("Errore:", error);
      res
        .status(500)
        .json({ error: "Errore durante l'elaborazione della schedina." });
    }
  }
);

const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server TypeScript avviato sulla porta ${PORT}`);
});
