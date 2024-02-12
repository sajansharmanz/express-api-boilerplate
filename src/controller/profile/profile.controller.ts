import { NextFunction, Request, Response } from "express";

import { ProfileService } from "../../service";

import { NotFoundError } from "../../errors";

import ERROR_MESSAGES from "../../constants/errorMessages";

import { ProfileForResponse, UpdateProfileRequest } from "../../types";

import { convertFileToBase64String } from "../../utils/file";

export class ProfileController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.profileService.findByUserId(req.user!.id);

      if (!profile) {
        return next(new NotFoundError(ERROR_MESSAGES.profile.notFound));
      }

      return res.status(200).send(profile);
    } catch (error) {
      return next(error);
    }
  };

  update = async (
    req: Request<never, never, UpdateProfileRequest, never>,
    res: Response<ProfileForResponse>,
    next: NextFunction,
  ) => {
    try {
      const { firstName, lastName } = req.body;

      const profile = await this.profileService.updateByUserId(
        req.user!.id,
        firstName,
        lastName,
      );

      return res.status(200).send(profile);
    } catch (error) {
      return next(error);
    }
  };

  createAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { originalname, mimetype, size, buffer } =
        req.file! as Express.Multer.File;

      const file = await this.profileService.createAvatarByUserId(
        req.user!.id,
        originalname,
        mimetype,
        size,
        buffer,
      );

      return res.status(201).send(convertFileToBase64String(file));
    } catch (error) {
      return next(error);
    }
  };

  findAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = await this.profileService.findAvatarByUserId(req.user!.id);

      if (!file) {
        return next(new NotFoundError(ERROR_MESSAGES.profile.avatarNotFound));
      }

      return res.status(200).send(convertFileToBase64String(file));
    } catch (error) {
      return next(error);
    }
  };

  deleteAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.profileService.deleteAvatarByUserId(req.user!.id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
