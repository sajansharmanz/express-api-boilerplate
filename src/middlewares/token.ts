/* eslint-disable require-atomic-updates */
import { NextFunction, Response, Request } from "express";
import { TokenType } from "@prisma/client";

import { AuthenticationError } from "../errors";

import { UserForResponse } from "../types";

import { verifyToken } from "../utils/tokens";

import { TokenService } from "../service";

const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { accessToken } = req.signedCookies;

    if (!accessToken) {
      return next(new AuthenticationError());
    }

    const user = (await verifyToken(
      String(accessToken),
      TokenType.ACCESS,
    )) as UserForResponse;

    req.user = user;

    return next();
  } catch (error) {
    try {
      const { refreshToken } = req.signedCookies;

      if (!refreshToken) {
        return next(new AuthenticationError());
      }

      const tokenService = new TokenService();
      const parsedToken = String(refreshToken);

      if (!(await tokenService.checkTokenExists(parsedToken))) {
        return next(new AuthenticationError());
      }

      await tokenService.deleteToken(parsedToken);

      const user = (await verifyToken(
        parsedToken,
        TokenType.REFRESH,
      )) as UserForResponse;

      req.user = user;

      await tokenService.generateAccessToken(user, res);
      await tokenService.generateRefreshToken(user, res);

      return next();
    } catch (error) {
      return next(new AuthenticationError());
    }
  }
};

export default checkAuth;
