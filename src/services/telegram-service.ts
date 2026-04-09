import TelegramBot from "node-telegram-bot-api";
import { ChannelType } from "../types/common";

class TelegramValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const sendTelegramChannelMessage = async (
  channel: unknown,
  message: unknown
) => {
  const channelType = parseChannel(channel);
  const text = parseMessage(message);

  await sendMessage(channelType, text);
};

export const sendMessage = async (channelType: ChannelType, text: string) => {
  try {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "", {
      polling: false,
    });

    const channelId = chooseChannel(channelType);

    await bot.sendMessage(channelId ?? "", text, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error sending message to Telegram: ", error);
    throw new Error("Unable to send message to Telegram.");
  }
};

export const isTelegramValidationError = (
  error: unknown
): error is TelegramValidationError => {
  return error instanceof TelegramValidationError;
};

const parseChannel = (channel: unknown): ChannelType => {
  if (channel === "public" || channel === "premium") {
    return channel;
  }

  throw new TelegramValidationError(
    "Invalid channel query parameter. Use 'public' or 'premium'."
  );
};

const parseMessage = (message: unknown): string => {
  if (typeof message === "string" && message.trim().length > 0) {
    return message;
  }

  throw new TelegramValidationError("Message is required in request body.");
};

const chooseChannel = (channelType: ChannelType): string | undefined => {
  if (channelType === "public") {
    return process.env.TELEGRAM_PUBLIC_CHANNEL_ID;
  }
  if (channelType === "premium") {
    return process.env.TELEGRAM_VIP_CHANNEL_ID || "";
  }
  throw new Error("Invalid channel type provided.");
};
