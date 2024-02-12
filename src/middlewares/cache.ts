import { NextFunction, Request, Response } from "express";
import ROUTE_NAMES from "../constants/routeNames";

const setCache = (req: Request, res: Response, next: NextFunction) => {
  // Period in seconds
  const cachePeriod = 60 * 5;

  if (req.method === "GET" && !req.path.includes(ROUTE_NAMES.SWAGGER)) {
    res.set("Cache-Control", `public, max-age=${cachePeriod}`);
  } else {
    res.set("Cache-control", `no-store`);
  }

  next();
};

export default setCache;
