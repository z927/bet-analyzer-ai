import { ChannelType } from "../types/common";

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

export const parseMessage = (message: unknown): string => {
  if (typeof message === "string" && message.trim().length > 0) {
    return message;
  }

  throw new TelegramValidationError("Message is required in request body.");
};
