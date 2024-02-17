import { NextFunction, Request, Response } from "express";
import ROUTE_NAMES from "../constants/routeNames";

const setCache = (req: Request, res: Response, next: NextFunction) => {
  // Period in seconds
  const cachePeriod = 60 * 5;

  const ignoreRoutes: string[] = [
    ROUTE_NAMES.SWAGGER,
    ROUTE_NAMES.HEALTHCHECK,
    ROUTE_NAMES.CSRF_TOKEN,
  ];

  if (
    req.method === "GET" &&
    !ignoreRoutes.some((value) => req.path.includes(value))
  ) {
    res.set("Cache-Control", `public, max-age=${cachePeriod}`);
  } else {
    res.set("Cache-control", `no-store`);
  }

  next();
};

export default setCache;
