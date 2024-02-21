import { Router } from "express";
import multer, { Multer } from "multer";

import { ApiRouter } from "../../types";

import checkAuth from "../../middlewares/token";
import canAccess from "../../middlewares/permission";
import schemaValidator, {
  VALIDATION_AREA,
} from "../../middlewares/schemaValidator";

import ROUTE_NAMES from "../../constants/routeNames";
import PERMISSIONS from "../../constants/permissions";

import { ProfileController } from "../../controller";

import { FileSchemas, ProfileSchemas } from "../../schemas";

export class ProfileRouter implements ApiRouter {
  public router: Router = Router();
  private upload: Multer = multer();
  private avatarUploadFieldName = "avatar";
  private profileController: ProfileController;
  private profileSchemas: ProfileSchemas;
  private fileSchemas: FileSchemas;

  constructor() {
    this.profileController = new ProfileController();
    this.profileSchemas = new ProfileSchemas();
    this.fileSchemas = new FileSchemas();
    this.initialiseRoutes();
  }

  private initialiseRoutes = () => {
    this.router.get(
      ROUTE_NAMES.GET_PROFILE,
      checkAuth,
      canAccess(PERMISSIONS.READ_PROFILE),
      this.profileController.find,
    );

    this.router.patch(
      ROUTE_NAMES.PATCH_PROFILE,
      checkAuth,
      canAccess(PERMISSIONS.UPDATE_PROFILE),
      schemaValidator(this.profileSchemas.update),
      this.profileController.update,
    );

    this.router.post(
      ROUTE_NAMES.CREATE_AVATAR,
      checkAuth,
      canAccess(PERMISSIONS.CREATE_FILE, PERMISSIONS.UPDATE_PROFILE),
      this.upload.single(this.avatarUploadFieldName),
      schemaValidator(
        this.fileSchemas.contentType,
        VALIDATION_AREA.CONTENT_TYPE,
      ),
      schemaValidator(this.fileSchemas.imageType, VALIDATION_AREA.FILE),
      this.profileController.createAvatar,
    );

    this.router.get(
      ROUTE_NAMES.GET_AVATAR,
      checkAuth,
      canAccess(PERMISSIONS.READ_FILE, PERMISSIONS.READ_PROFILE),
      this.profileController.findAvatar,
    );

    this.router.delete(
      ROUTE_NAMES.DELETE_AVATAR,
      checkAuth,
      canAccess(PERMISSIONS.DELETE_FILE, PERMISSIONS.DELETE_PROFILE),
      this.profileController.deleteAvatar,
    );
  };
}
