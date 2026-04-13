import { Router, Request, Response } from "express";
import { sendTelegramChannelMessage } from "../services/telegram-service";
import { isTelegramValidationError } from "../utils/validator";

const telegramRouter = Router();

telegramRouter.post("/send-message", async (req: Request, res: Response) => {
  try {
    await sendTelegramChannelMessage(req.query.channel, req.body);

    return res.status(200).json({
      success: true,
      message: "Message sent to Telegram channel.",
    });
  } catch (error) {
    if (isTelegramValidationError(error)) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    }

    console.error("Telegram router error: ", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
});

export default telegramRouter;
