import { Router } from "express";
import { ApiRouter } from "../../types";
import { RootController } from "../../controller";

export class RootRouter implements ApiRouter {
  public router: Router = Router();
  private rootController: RootController;

  constructor() {
    this.rootController = new RootController();
    this.initialiseRoutes();
  }

  private initialiseRoutes = () => {
    this.router.get("/healthcheck", this.rootController.healthCheck);
    this.router.get("/csrftoken", this.rootController.csrf);
    this.router.all("*", this.rootController.notFound);
  };
}
