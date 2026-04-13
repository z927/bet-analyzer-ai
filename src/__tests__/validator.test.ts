import { parseAnalyzerOutput, TelegramValidationError } from "../utils/validator";

const validPayload = {
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

describe("parseAnalyzerOutput", () => {
  it("returns payload when AnalyzerOutput shape is valid", () => {
    expect(parseAnalyzerOutput(validPayload)).toEqual(validPayload);
  });

  it("throws TelegramValidationError for invalid payload", () => {
    expect(() => parseAnalyzerOutput({ message: "ciao" })).toThrow(
      TelegramValidationError
    );
  });
});
