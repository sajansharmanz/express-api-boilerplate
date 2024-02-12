import * as jose from "jose";
import { TokenType } from "@prisma/client";

// Errors
import { InternalServerError } from "../errors";

// Consts
import ERROR_MESSAGES from "../constants/errorMessages";

// Configs
import {
  JWT_SECRET,
  PASSWORD_RESET_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  CSRF_TOKEN_SECRET,
} from "../configs/environment";

const determineSecret = (type: TokenType): Uint8Array => {
  switch (type) {
    case TokenType.REFRESH:
      return new TextEncoder().encode(REFRESH_TOKEN_SECRET);
    case TokenType.PASSWORD_RESET:
      return new TextEncoder().encode(PASSWORD_RESET_TOKEN_SECRET);
    case TokenType.CSRF:
      return new TextEncoder().encode(CSRF_TOKEN_SECRET);
    case TokenType.ACCESS:
    default:
      return new TextEncoder().encode(JWT_SECRET);
  }
};

const determineExpiresIn = (type: TokenType): string => {
  const FIFTEEN_MINS = "15m";
  const THIRTY_MINS = "30m";
  const SEVEN_DAYS = "7d";

  switch (type) {
    case TokenType.REFRESH:
      return SEVEN_DAYS;
    case TokenType.PASSWORD_RESET:
      return THIRTY_MINS;
    case TokenType.ACCESS:
    case TokenType.CSRF:
    default:
      return FIFTEEN_MINS;
  }
};

export const signToken = async (
  data: object,
  type: TokenType,
): Promise<string> => {
  try {
    return await new jose.SignJWT({ ...data })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(determineExpiresIn(type))
      .sign(determineSecret(type));
  } catch (error) {
    throw new InternalServerError(ERROR_MESSAGES.utils.signingToken);
  }
};

export const verifyToken = async (
  token: string,
  type: TokenType,
): Promise<jose.JWTPayload> => {
  try {
    const { payload } = await jose.jwtVerify(token, determineSecret(type), {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    if (
      error instanceof jose.errors.JWTExpired ||
      error instanceof jose.errors.JWSInvalid
    ) {
      throw error;
    }

    throw new InternalServerError(ERROR_MESSAGES.utils.verifyingToken);
  }
};
