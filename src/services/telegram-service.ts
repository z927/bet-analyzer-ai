import TelegramBot from "node-telegram-bot-api";
import { AnalyzerOutput, BetType, ChannelType } from "../types/common";
import { parseChannel, parseAnalyzerOutput } from "../utils/validator";

export const sendTelegramChannelMessage = async (
  channel: ChannelType,
  analyzerOutput: AnalyzerOutput,
  imageBuffer: Buffer
) => {
  console.log(analyzerOutput);

  const channelType = parseChannel(channel);
  const parsedOutput = parseAnalyzerOutput(analyzerOutput);
  const text = formatTelegramMessage(parsedOutput);

  await sendImage(channelType, imageBuffer, text);
};

export const sendImage = async (
  channelType: ChannelType,
  imageBuffer: Buffer,
  caption?: string
) => {
  try {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "", {
      polling: false,
    });

    const channelId = chooseChannel(channelType);

    await bot.sendPhoto(channelId ?? "", imageBuffer, {
      caption: caption ?? "📸 Schedina originale",
      parse_mode: "MarkdownV2",
    });
  } catch (error: any) {
    console.error("Error sending image to Telegram: ", error.message);
    throw new Error("Unable to send image to Telegram.");
  }
};

const chooseChannel = (channelType: ChannelType): string | undefined => {
  if (channelType === "public") {
    return process.env.TELEGRAM_PUBLIC_CHANNEL_ID;
  }
  if (channelType === "premium") {
    return process.env.TELEGRAM_VIP_CHANNEL_ID;
  }
  if (channelType === "private") {
    return process.env.TELEGRAM_PRIVATE_CHANNEL_ID;
  }
  throw new Error("Invalid channel type provided.");
};

export const formatTelegramMessage = (output: AnalyzerOutput): string => {
  const betType = detectBetType(output.selections.length);
  const selectionsText = output.selections
    .map((selection, index) =>
      [
        `*${index + 1}\\. ${escapeMarkdown(selection.event)}*`,
        `   • Scelta: ${escapeMarkdown(selection.selection)}`,
        `   • Quota: ${escapeMarkdown(selection.odds)}`,
      ].join("\n")
    )
    .join("\n\n");

  return [
    "🎯 *Giocata del giorno*",
    "",
    `🏦 Bookmaker: *${escapeMarkdown(output.bookmaker)}*`,
    `📅 Data: ${escapeMarkdown(output.date)}`,
    `🎲 Tipo: *${escapeMarkdown(betType)}*`,
    `📈 Quota totale: ${escapeMarkdown(output.totalOdds)}`,
    "",
    "🧾 *Dettaglio Eventi*",
    selectionsText,
  ].join("\n");
};

export const detectBetType = (selectionCount: number): BetType => {
  if (selectionCount <= 1) {
    return "Singola";
  }
  if (selectionCount === 2) {
    return "Doppia";
  }
  if (selectionCount === 3) {
    return "Tripla";
  }
  return "Multipla";
};

const escapeMarkdown = (value: string): string => {
  return value.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
};
