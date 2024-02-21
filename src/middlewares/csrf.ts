import { Request, Response, NextFunction } from "express";
import { TokenType } from "@prisma/client";
import * as jose from "jose";

import { ForbiddenError } from "../errors";
import { verifyToken } from "../utils/tokens";

import { CSRF_TOKEN_HEADER_NAME, TokenService } from "../service";
import ERROR_MESSAGES from "../constants/errorMessages";

const validateCSRF = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.method === "GET") {
      return next();
    }

    const { csrfToken } = req.signedCookies;
    const headerToken = req.get(CSRF_TOKEN_HEADER_NAME);

    if (!csrfToken || !headerToken) {
      return next(new ForbiddenError());
    }

    const { token: cookieToken } = (await verifyToken(
      String(csrfToken),
      TokenType.CSRF,
    )) as { token: string };

    if (cookieToken !== headerToken) {
      return next(new ForbiddenError());
    }

    const tokenService = new TokenService();
    await tokenService.generateCSRFToken(res);

    return next();
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      const tokenService = new TokenService();
      await tokenService.generateCSRFToken(res);
    }

    return next(new ForbiddenError(ERROR_MESSAGES.middleware.csrfExpired));
  }
};

export default validateCSRF;
