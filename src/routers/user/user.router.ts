import { Router } from "express";

import { ApiRouter } from "../../types";

import ROUTE_NAMES from "../../constants/routeNames";
import PERMISSIONS from "../../constants/permissions";

import rateLimit from "../../middlewares/rateLimit";
import schemaValidator from "../../middlewares/schemaValidator";
import checkAuth from "../../middlewares/token";
import canAccess from "../../middlewares/permission";
import checkOrigin from "../../middlewares/checkOrigin";
import validateCSRF from "../../middlewares/csrf";

import { UserController } from "../../controller";

import { UserSchemas } from "../../schemas";

export class UserRouter implements ApiRouter {
  public router: Router = Router();
  private userController: UserController;
  private userSchemas: UserSchemas;

  constructor() {
    this.userController = new UserController();
    this.userSchemas = new UserSchemas();
    this.initialiseRoutes();
  }

  private initialiseRoutes = () => {
    this.router.post(
      ROUTE_NAMES.SIGN_UP,
      rateLimit,
      checkOrigin,
      validateCSRF,
      schemaValidator(this.userSchemas.signUp),
      this.userController.signup,
    );

    this.router.post(
      ROUTE_NAMES.LOGIN,
      rateLimit,
      checkOrigin,
      validateCSRF,
      schemaValidator(this.userSchemas.login),
      this.userController.login,
    );

    this.router.post(
      ROUTE_NAMES.LOGOUT,
      checkOrigin,
      validateCSRF,
      checkAuth,
      this.userController.logout,
    );

    this.router.post(
      ROUTE_NAMES.LOGOUT_ALL,
      checkOrigin,
      validateCSRF,
      checkAuth,
      this.userController.logoutAll,
    );

    this.router.post(
      ROUTE_NAMES.FORGOT_PASSWORD,
      rateLimit,
      checkOrigin,
      validateCSRF,
      schemaValidator(this.userSchemas.forgotPassword),
      this.userController.forgotPassword,
    );

    this.router.post(
      ROUTE_NAMES.PASSWORD_RESET,
      rateLimit,
      checkOrigin,
      validateCSRF,
      schemaValidator(this.userSchemas.passwordReset),
      this.userController.passwordReset,
    );

    this.router.get(
      ROUTE_NAMES.GET_ME,
      checkAuth,
      canAccess(PERMISSIONS.READ_USER),
      this.userController.findMe,
    );

    this.router.patch(
      ROUTE_NAMES.PATCH_ME,
      checkOrigin,
      validateCSRF,
      checkAuth,
      canAccess(PERMISSIONS.UPDATE_USER),
      schemaValidator(this.userSchemas.updateMe),
      this.userController.updateMe,
    );

    this.router.delete(
      ROUTE_NAMES.DELETE_ME,
      checkOrigin,
      validateCSRF,
      checkAuth,
      canAccess(PERMISSIONS.DELETE_USER),
      this.userController.deleteMe,
    );
  };
}
