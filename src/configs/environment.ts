import * as dotenv from "dotenv";
dotenv.config();

export const {
  NODE_ENV: ENV,
  ORIGIN_URLS,
  LOG_LEVEL,
  DATABASE_URL,
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  PASSWORD_RESET_TOKEN_SECRET,
  CSRF_TOKEN_SECRET,
  COOKIE_SECRET,
  MAX_FAILED_LOGIN_ATTEMPTS,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  NODEMAILER_SECURE,
  NODEMAILER_USERNAME,
  NODEMAILER_PASSWORD,
} = process.env;
