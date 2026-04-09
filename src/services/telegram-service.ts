import TelegramBot from "node-telegram-bot-api";
import { ChannelType } from "../types/common";
import { parseChannel, parseMessage } from "../utils/validator";

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

const chooseChannel = (channelType: ChannelType): string | undefined => {
  if (channelType === "public") {
    return process.env.TELEGRAM_PUBLIC_CHANNEL_ID;
  }
  if (channelType === "premium") {
    return process.env.TELEGRAM_VIP_CHANNEL_ID || "";
  }
  throw new Error("Invalid channel type provided.");
};
