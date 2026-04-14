import TelegramBot from "node-telegram-bot-api";
import { AnalyzerOutput, ChannelType } from "../types/common";
import { parseAnalyzerOutput, parseChannel } from "../utils/validator";

export const sendTelegramChannelMessage = async (
  channel: unknown,
  analyzerOutput: unknown
) => {
  const channelType = parseChannel(channel);
  const parsedOutput = parseAnalyzerOutput(analyzerOutput);
  const text = formatTelegramMessage(parsedOutput);

  await sendMessage(channelType, text);
};

export const sendTelegramChannelMessageWithImage = async (
  channel: unknown,
  analyzerOutput: unknown,
  imageBuffer: Buffer,
  mimeType: string
) => {
  const channelType = parseChannel(channel);
  const parsedOutput = parseAnalyzerOutput(analyzerOutput);
  const text = formatTelegramMessage(parsedOutput);

  await sendMessage(channelType, text);
  await sendImage(channelType, imageBuffer, mimeType);
};

export const formatTelegramMessage = (output: AnalyzerOutput): string => {
  const selectionsText = output.selections
    .map((selection, index) =>
      [
        `*${index + 1}\\. ${escapeMarkdown(selection.event)}*`,
        `   • Scelta: ${escapeMarkdown(selection.selection)}`,
        `   • Quota: ${escapeMarkdown(selection.odds)}`,
        `   • Esito: ${escapeMarkdown(selection.result)}`,
      ].join("\n")
    )
    .join("\n\n");

  return [
    "🎯 *Giocata del giorno*",
    "",
    `🏦 Bookmaker: *${escapeMarkdown(output.bookmaker)}*`,
    `📅 Data: ${escapeMarkdown(output.date)}`,
    `💶 Stake: ${escapeMarkdown(output.stake)}`,
    `💸 Vincita potenziale: ${escapeMarkdown(output.potentialWin)}`,
    `📈 Quota totale: ${escapeMarkdown(output.totalOdds)}`,
    `📊 Stato: ${escapeMarkdown(output.status)}`,
    "",
    "🧾 *Dettaglio selezioni*",
    selectionsText,
  ].join("\n");
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

export const sendImage = async (
  channelType: ChannelType,
  imageBuffer: Buffer,
  mimeType: string
) => {
  try {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "", {
      polling: false,
    });

    const channelId = chooseChannel(channelType);

    await bot.sendPhoto(channelId ?? "", imageBuffer, {
      contentType: mimeType,
      caption: "📸 Schedina originale",
    });
  } catch (error) {
    console.error("Error sending image to Telegram: ", error);
    throw new Error("Unable to send image to Telegram.");
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

const escapeMarkdown = (value: string): string => {
  return value.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
};
