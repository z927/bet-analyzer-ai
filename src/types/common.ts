export interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export type ChannelType = "public" | "premium";

export interface AnalyzerSelection {
  event: string;
  selection: string;
  odds: string;
  result: string;
}

export interface AnalyzerOutput {
  bookmaker: string;
  date: string;
  stake: string;
  potentialWin: string;
  totalOdds: string;
  status: string;
  selections: AnalyzerSelection[];
}
