import { NextFunction, Request, Response } from "express";

import { NotFoundError } from "../../errors";
import { TokenService } from "../../service";

export class RootController {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

  healthCheck = (_req: Request, res: Response) => {
    return res.status(200).send({ message: "API running" });
  };

  csrf = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await this.tokenService.generateCSRFToken(res);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  notFound = (req: Request, _res: Response, next: NextFunction): void => {
    return next(
      new NotFoundError(`The request ${req.method} ${req.url} was not found`),
    );
  };
}
