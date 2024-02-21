import { Router } from "express";

import { ApiRouter } from "../../types";

import { RootController } from "../../controller";

import ROUTE_NAMES from "../../constants/routeNames";

export class RootRouter implements ApiRouter {
  public router: Router = Router();
  private rootController: RootController;

  constructor() {
    this.rootController = new RootController();
    this.initialiseRoutes();
  }

  private initialiseRoutes = () => {
    this.router.get(ROUTE_NAMES.HEALTHCHECK, this.rootController.healthCheck);
    this.router.get(ROUTE_NAMES.CSRF_TOKEN, this.rootController.csrf);
    this.router.all("*", this.rootController.notFound);
  };
}
