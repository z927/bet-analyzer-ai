import { AnalyzerOutput, ChannelType } from "../types/common";

export class TelegramValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const isTelegramValidationError = (
  error: unknown
): error is TelegramValidationError => {
  return error instanceof TelegramValidationError;
};

export const parseChannel = (channel: unknown): ChannelType => {
  if (channel === "public" || channel === "premium") {
    return channel;
  }

  throw new TelegramValidationError(
    "Invalid channel query parameter. Use 'public' or 'premium'."
  );
};

export const parseAnalyzerOutput = (payload: unknown): AnalyzerOutput => {
  const parsedPayload = payload as AnalyzerOutput;

  if (
    typeof payload === "object" &&
    payload !== null &&
    typeof parsedPayload.bookmaker === "string" &&
    typeof parsedPayload.date === "string" &&
    typeof parsedPayload.totalOdds === "string" &&
    Array.isArray(parsedPayload.selections) &&
    parsedPayload.selections.every(isAnalyzerSelection)
  ) {
    return parsedPayload;
  }

  throw new TelegramValidationError(
    "AnalyzerOutput payload is required in request body."
  );
};

const isAnalyzerSelection = (
  selection: AnalyzerOutput["selections"][number]
): boolean => {
  return (
    typeof selection.event === "string" &&
    typeof selection.selection === "string" &&
    typeof selection.odds === "string"
  );
};
