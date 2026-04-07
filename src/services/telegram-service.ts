import TelegramBot from "node-telegram-bot-api";
import { ChannelType } from "../types/common";

export const sendMessage = async (channelType: ChannelType, text: string) => {
  try {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "", {
      polling: false,
    });

    const channelId = chooseChannel(channelType);

    await bot.sendMessage(channelId ?? "", text, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error sending message to Telegram: ", error);
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
