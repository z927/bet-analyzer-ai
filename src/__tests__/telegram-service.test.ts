import TelegramBot from "node-telegram-bot-api";
import {
  formatTelegramMessage,
  sendImage,
  sendTelegramChannelMessageWithImage,
} from "../services/telegram-service";
import { AnalyzerOutput } from "../types/common";

jest.mock("node-telegram-bot-api");

const mockedTelegramBot = TelegramBot as unknown as jest.Mock;

describe("formatTelegramMessage", () => {
  it("creates a Telegram styled message from AnalyzerOutput", () => {
    const output: AnalyzerOutput = {
      bookmaker: "Bookmaker X",
      date: "2026-04-13",
      stake: "€10",
      potentialWin: "€45",
      totalOdds: "4.5",
      status: "OPEN",
      selections: [
        {
          event: "Team A vs Team B",
          selection: "Team A vince",
          odds: "1.8",
          result: "PENDING",
        },
      ],
    };

    const result = formatTelegramMessage(output);

    expect(result).toContain("🎯 *Giocata del giorno*");
    expect(result).toContain("🧾 *Dettaglio selezioni*");
    expect(result).toContain("Bookmaker X");
    expect(result).toContain("Team A vs Team B");
  });
});

describe("sendImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TELEGRAM_PUBLIC_CHANNEL_ID = "@public_channel";
    process.env.TELEGRAM_BOT_TOKEN = "token";
  });

  it("sends image to telegram public channel", async () => {
    const sendPhoto = jest.fn().mockResolvedValue(undefined);
    mockedTelegramBot.mockImplementation(() => ({ sendPhoto }));

    await sendImage("public", Buffer.from("img"), "image/png");

    expect(sendPhoto).toHaveBeenCalledWith(
      "@public_channel",
      expect.any(Buffer),
      expect.objectContaining({
        contentType: "image/png",
      })
    );
  });
});

describe("sendTelegramChannelMessageWithImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TELEGRAM_PUBLIC_CHANNEL_ID = "@public_channel";
    process.env.TELEGRAM_BOT_TOKEN = "token";
  });

  it("sends both message and image", async () => {
    const sendMessage = jest.fn().mockResolvedValue(undefined);
    const sendPhoto = jest.fn().mockResolvedValue(undefined);
    mockedTelegramBot.mockImplementation(() => ({ sendMessage, sendPhoto }));

    const output: AnalyzerOutput = {
      bookmaker: "Bookmaker X",
      date: "2026-04-13",
      stake: "€10",
      potentialWin: "€45",
      totalOdds: "4.5",
      status: "OPEN",
      selections: [
        {
          event: "Team A vs Team B",
          selection: "Team A vince",
          odds: "1.8",
          result: "PENDING",
        },
      ],
    };

    await sendTelegramChannelMessageWithImage(
      "public",
      output,
      Buffer.from("img"),
      "image/jpeg"
    );

    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendPhoto).toHaveBeenCalledTimes(1);
  });
});
