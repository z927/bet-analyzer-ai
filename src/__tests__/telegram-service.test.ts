import { formatTelegramMessage } from "../services/telegram-service";
import { AnalyzerOutput } from "../types/common";

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
