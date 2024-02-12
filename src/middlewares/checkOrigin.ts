import { Request, Response, NextFunction } from "express";
import { ORIGIN_URLS } from "../configs/environment";
import { ForbiddenError } from "../errors";

const checkOrigin = (req: Request, _res: Response, next: NextFunction) => {
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigins = ORIGIN_URLS.split(",").map((origin) => origin.trim());

  if (origin && allowedOrigins.includes(origin)) {
    return next();
  }

  return next(new ForbiddenError());
};

export default checkOrigin;
