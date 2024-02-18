declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      ORIGIN_URLS: string;
      NODE_ENV: "development" | "test" | "production";
      LOG_LEVEL:
        | "error"
        | "warn"
        | "info"
        | "http"
        | "verbose"
        | "debug"
        | "silly";
      DATABASE_URL: string;
      ENCRYPTION_SECRET: string;
      JWT_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      PASSWORD_RESET_TOKEN_SECRET: string;
      CSRF_TOKEN_SECRET: string;
      COOKIE_SECRET: string;
      MAX_FAILED_LOGIN_ATTEMPTS: number;
      DEFAULT_ADMIN_EMAIL: string;
      DEFAULT_ADMIN_PASSWORD: string;
      NODEMAILER_HOST: string;
      NODEMAILER_PORT: number;
      NODEMAILER_SECURE: boolean;
      NODEMAILER_USERNAME: string;
      NODEMAILER_PASSWORD: string;
      OTP_ISSUER: string;
      OTP_LABEL: string;
    }
  }
}

export {};
