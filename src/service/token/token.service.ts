import crypto from "crypto";
import { CookieOptions, Response } from "express";
import { PrismaClient, TokenType } from "@prisma/client";

import { signToken } from "../../utils/tokens";
import { hashString } from "../../utils/crypto";

import { UserForResponse } from "../../types/user/user.types";

export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
export const CSRF_TOKEN_COOKIE_NAME = "csrfToken";
export const CSRF_TOKEN_HEADER_NAME = "x-csrf-token";

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  signed: true,
  sameSite: "strict",
  maxAge: 604800000,
};

export class TokenService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  generateAccessToken = async (
    user: UserForResponse,
    res: Response,
  ): Promise<void> => {
    const token = await signToken(user, TokenType.ACCESS);

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, token, { ...COOKIE_OPTIONS });
  };

  generateRefreshToken = async (
    user: UserForResponse,
    res: Response,
  ): Promise<void> => {
    const token = await signToken(user, TokenType.REFRESH);
    const hashedToken = await hashString(token);

    await this.prisma.token.create({
      data: {
        userId: user.id,
        token: hashedToken,
        type: TokenType.REFRESH,
      },
    });

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, { ...COOKIE_OPTIONS });
  };

  generatePasswordResetToken = async (email: string): Promise<string> => {
    // Delete any existing tokens first
    await this.prisma.token.deleteMany({
      where: {
        user: {
          email,
        },
        token: TokenType.PASSWORD_RESET,
      },
    });

    const passwordResetToken = await signToken(
      { email },
      TokenType.PASSWORD_RESET,
    );

    const hashedToken = await hashString(passwordResetToken);

    await this.prisma.token.create({
      data: {
        user: {
          connect: {
            email,
          },
        },
        token: hashedToken,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return passwordResetToken;
  };

  generateCSRFToken = async (res: Response): Promise<void> => {
    const token = crypto.randomBytes(32).toString("hex");

    const csrfToken = await signToken({ token }, TokenType.CSRF);

    res.cookie(CSRF_TOKEN_COOKIE_NAME, csrfToken, { ...COOKIE_OPTIONS });
    res.set(CSRF_TOKEN_HEADER_NAME, token);
  };

  clearCookies = (res: Response) => {
    res
      .clearCookie(ACCESS_TOKEN_COOKIE_NAME)
      .clearCookie(REFRESH_TOKEN_COOKIE_NAME)
      .clearCookie(CSRF_TOKEN_COOKIE_NAME);
  };

  deleteToken = async (token: string): Promise<void> => {
    const hashedToken = await hashString(token);

    await this.prisma.token.delete({
      where: {
        token: hashedToken,
      },
    });
  };

  deleteAllRefreshTokens = async (userId: string): Promise<void> => {
    await this.prisma.token.deleteMany({
      where: {
        userId,
        type: TokenType.REFRESH,
      },
    });
  };

  checkTokenExists = async (refreshToken: string): Promise<boolean> => {
    const hashedToken = await hashString(refreshToken);

    return (
      (await this.prisma.token.count({
        where: {
          token: hashedToken,
        },
      })) > 0
    );
  };
}
