/* eslint-disable no-console */
import Api from "./app";

import {
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
  PASSWORD_RESET_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "./configs/environment";
import Logger from "./configs/logger";

import ERROR_MESSAGES from "./constants/errorMessages";

const initialiseServer = async () => {
  try {
    await import("node:crypto");
  } catch (error) {
    throw new Error(ERROR_MESSAGES.server.nodeCryptoMissing);
  }

  if (
    !JWT_SECRET ||
    !REFRESH_TOKEN_SECRET ||
    !PASSWORD_RESET_TOKEN_SECRET ||
    !COOKIE_SECRET ||
    !DATABASE_URL
  ) {
    throw new Error(ERROR_MESSAGES.server.environmentVariableMissing);
  }

  new Api();
};

initialiseServer().catch((error) => {
  Logger.error(error);
  console.error(error);
  process.exit(0);
});
