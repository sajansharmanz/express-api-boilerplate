import { Router } from "express";

import { ApiRouter } from "../../types";

import ROUTE_NAMES from "../../constants/routeNames";

import checkOrigin from "../../middlewares/checkOrigin";
import validateCSRF from "../../middlewares/csrf";
import checkAuth from "../../middlewares/token";
import schemaValidator from "../../middlewares/schemaValidator";

import { OTPController } from "../../controller";

import { OTPSchemas } from "../../schemas";

export class OTPRouter implements ApiRouter {
  public router: Router = Router();
  private otpController: OTPController;
  private otpSchemas: OTPSchemas;

  constructor() {
    this.otpController = new OTPController();
    this.otpSchemas = new OTPSchemas();
    this.initialiseRoutes();
  }

  private initialiseRoutes = () => {
    this.router.post(
      ROUTE_NAMES.OTP_GENERATE,
      checkOrigin,
      validateCSRF,
      checkAuth,
      this.otpController.generate,
    );

    this.router.post(
      ROUTE_NAMES.OTP_VERIFY,
      checkOrigin,
      validateCSRF,
      checkAuth,
      schemaValidator(this.otpSchemas.verify),
      this.otpController.verify,
    );

    this.router.post(
      ROUTE_NAMES.OTP_VALIDATE,
      checkOrigin,
      validateCSRF,
      schemaValidator(this.otpSchemas.validate),
      this.otpController.validate,
    );

    this.router.post(
      ROUTE_NAMES.OTP_DISABLE,
      checkOrigin,
      validateCSRF,
      checkAuth,
      this.otpController.disable,
    );
  };
}
