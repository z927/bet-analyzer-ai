import { GenerativePart } from "../types/common";
import fs from "fs";

export const fileToGenerativePart = (
  filePath: string,
  mimeType: string
): GenerativePart => ({
  inlineData: {
    data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
    mimeType,
  },
});
