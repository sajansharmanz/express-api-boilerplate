/* eslint-disable no-console */
import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import express, { json, Express } from "express";
import helmet from "helmet";
import { IncomingMessage, ServerResponse, Server } from "http";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { COOKIE_SECRET } from "./configs/environment";

import ROUTE_NAMES from "./constants/routeNames";

import cors from "./middlewares/cors";
import rateLimit from "./middlewares/rateLimit";
import httpLogger from "./middlewares/httpLogger";
import setCache from "./middlewares/cache";
import errorMiddleware from "./middlewares/error";

import { isDevelopment } from "./utils/environment";

import Logger from "./configs/logger";

import { ApiRouter } from "./types";

import { OTPRouter, ProfileRouter, RootRouter, UserRouter } from "./routers";

export type ApiServer = Server<typeof IncomingMessage, typeof ServerResponse>;

export default class Api {
  public server: ApiServer;
  private app: Express;
  private PORT = process.env.PORT || 8080;
  private swaggerDocument = YAML.load(
    path.join(__dirname, "./configs/swagger.yml"),
  );

  constructor() {
    this.app = express();
    this.setupApp(this.app);
    this.server = this.startServer(this.app);
  }

  private setupApp = (app: Express) => {
    app.use(cors);

    app.use(rateLimit);
    app.use(httpLogger);

    app.use(json());
    app.use(compression());
    app.use(helmet());
    app.use(cookieParser(COOKIE_SECRET));

    app.use(setCache);

    app.use(
      ROUTE_NAMES.SWAGGER,
      swaggerUi.serve,
      swaggerUi.setup(this.swaggerDocument),
    );

    /**
     * We must ensure that the RootRouter
     * always goes last.
     */
    const routes: Array<ApiRouter> = [
      new UserRouter(),
      new OTPRouter(),
      new ProfileRouter(),
      new RootRouter(),
    ];

    routes.forEach((route) => {
      app.use(route.router);
    });

    app.use(errorMiddleware);
  };

  private startServer = (app: Express): ApiServer => {
    const server = app.listen(this.PORT, () => {
      const serverStartedMessage = `Server started on port ${this.PORT}`;

      Logger.debug(serverStartedMessage);

      if (isDevelopment()) {
        console.info(serverStartedMessage);
      }
    });

    server.on("error", (error: Error) => {
      Logger.error(error);
      console.error(error);
    });

    return server;
  };
}
