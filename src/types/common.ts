export interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export type ChannelType = "public" | "premium" | "private";

export interface AnalyzerSelection {
  event: string;
  selection: string;
  odds: string;
}

export interface AnalyzerOutput {
  bookmaker: string;
  date: string;
  totalOdds: string;
  selections: AnalyzerSelection[];
}

export type BetType = "singola" | "double" | "triple" | "multipla";
