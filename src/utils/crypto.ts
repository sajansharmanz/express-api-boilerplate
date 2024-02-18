import { encode } from "hi-base32";

// Configs
import Logger from "../configs/logger";
import { ENCRYPTION_SECRET } from "../configs/environment";

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

export const generateRandomBase32 = async (): Promise<string> => {
  const crypto = await import("node:crypto");

  return encode(crypto.randomBytes(15)).replace(/=/g, "").substring(0, 24);
};

export const encrypt = async (text: string) => {
  const crypto = await import("node:crypto");

  const iv = crypto.randomBytes(12);
  const key = crypto.scryptSync(ENCRYPTION_SECRET, "salt", 32);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
    authTag: cipher.getAuthTag().toString("hex"),
  };
};

export const decrypt = async (content: string, iv: string, authTag: string) => {
  const crypto = await import("node:crypto");

  const key = crypto.scryptSync(ENCRYPTION_SECRET, "salt", 32);

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "hex"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
