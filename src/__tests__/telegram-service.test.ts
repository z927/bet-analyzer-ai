import TelegramBot from "node-telegram-bot-api";
import {
  detectBetType,
  formatTelegramMessage,
  sendImage,
  sendTelegramChannelMessage,
} from "../services/telegram-service";
import { AnalyzerOutput } from "../types/common";

jest.mock("node-telegram-bot-api");

const mockedTelegramBot = TelegramBot as unknown as jest.Mock;

describe("formatTelegramMessage", () => {
  it("creates a Telegram styled message from AnalyzerOutput", () => {
    const output: AnalyzerOutput = {
      bookmaker: "Bookmaker X",
      date: "2026-04-13",
      totalOdds: "4.5",
      selections: [
        {
          event: "Team A vs Team B",
          selection: "Team A vince",
          odds: "1.8",
        },
      ],
    };

    const result = formatTelegramMessage(output);

    expect(result).toContain("🎯 *Giocata del giorno*");
    expect(result).toContain("🧾 *Dettaglio Eventi*");
    expect(result).toContain("🎲 Tipo: *singola*");
    expect(result).toContain("Bookmaker X");
    expect(result).toContain("Team A vs Team B");
  });

  it("escapes markdown special characters using MarkdownV2 format", () => {
    const output: AnalyzerOutput = {
      bookmaker: "Bookmaker_(X)",
      date: "2026-04-13",
      totalOdds: "4.5",
      selections: [
        {
          event: "Team [A] vs Team_B",
          selection: "Over 2.5!",
          odds: "1.8",
        },
      ],
    };

    const result = formatTelegramMessage(output);

    expect(result).toContain("Bookmaker\\_\\(X\\)");
    expect(result).toContain("Team \\[A\\] vs Team\\_B");
    expect(result).toContain("Over 2\\.5\\!");
  });
});

describe("detectBetType", () => {
  it("returns bet type based on number of selections", () => {
    expect(detectBetType(1)).toBe("singola");
    expect(detectBetType(2)).toBe("double");
    expect(detectBetType(3)).toBe("triple");
    expect(detectBetType(4)).toBe("multipla");
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

    await sendImage("public", Buffer.from("img"), "*caption markdown*");

    expect(sendPhoto).toHaveBeenCalledWith(
      "@public_channel",
      expect.any(Buffer),
      expect.objectContaining({
        caption: "*caption markdown*",
        parse_mode: "MarkdownV2",
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

  it("sends a single post with image and caption", async () => {
    const sendMessage = jest.fn().mockResolvedValue(undefined);
    const sendPhoto = jest.fn().mockResolvedValue(undefined);
    mockedTelegramBot.mockImplementation(() => ({ sendMessage, sendPhoto }));

    const output: AnalyzerOutput = {
      bookmaker: "Bookmaker X",
      date: "2026-04-13",
      totalOdds: "4.5",
      selections: [
        {
          event: "Team A vs Team B",
          selection: "Team A vince",
          odds: "1.8",
        },
      ],
    };

    await sendTelegramChannelMessage("public", output, Buffer.from("img"));

    expect(sendMessage).toHaveBeenCalledTimes(0);
    expect(sendPhoto).toHaveBeenCalledTimes(1);

    expect(sendPhoto).toHaveBeenCalledWith(
      "@public_channel",
      expect.any(Buffer),
      expect.objectContaining({
        parse_mode: "MarkdownV2",
        caption: expect.stringContaining("🎯 *Giocata del giorno*"),
      })
    );
  });
});
