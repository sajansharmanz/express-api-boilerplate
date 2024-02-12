// Configs
import Logger from "../configs/logger";

// Consts
import ERROR_MESSAGES from "../constants/errorMessages";

// Errors
import { InternalServerError } from "../errors";

export const hashString = async (value: string): Promise<string> => {
  try {
    const crypto = await import("node:crypto");

    return crypto.createHash("sha256").update(value).digest("hex");
  } catch (error) {
    Logger.error(error);
    throw new InternalServerError(ERROR_MESSAGES.utils.hashingString);
  }
};
