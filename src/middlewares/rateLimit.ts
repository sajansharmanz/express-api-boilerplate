import { Request, Response, NextFunction } from "express";
import { rateLimit as RL } from "express-rate-limit";

// Utils
import { isProduction } from "../utils/environment";

// Consts
import ROUTE_NAMES from "../constants/routeNames";

const rateLimit = !isProduction()
  ? (_req: Request, _res: Response, next: NextFunction) => next()
  : RL({
      windowMs: 15 * 60 * 1000,
      max: (req: Request) => {
        switch (req.path) {
          case ROUTE_NAMES.SIGN_UP:
          case ROUTE_NAMES.LOGIN:
          case ROUTE_NAMES.FORGOT_PASSWORD:
          case ROUTE_NAMES.PASSWORD_RESET:
            return 5;
          default:
            return 50;
        }
      },
    });

export default rateLimit;
