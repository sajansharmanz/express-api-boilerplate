import { Request, Response, NextFunction } from "express";
import { TOTP } from "otpauth";
import { UserStatus } from "@prisma/client";

import { decrypt, generateRandomBase32 } from "../../utils/crypto";

import { EmailService, TokenService, UserService } from "../../service";

import { OTPGenerateResponse } from "../../types";

import { AuthenticationError, ValidationError } from "../../errors";

import ERROR_MESSAGES from "../../constants/errorMessages";

import {
  MAX_FAILED_LOGIN_ATTEMPTS,
  OTP_ISSUER,
  OTP_LABEL,
} from "../../configs/environment";

export class OTPController {
  private otpIssuer = OTP_ISSUER;
  private otpLabel = OTP_LABEL;
  private algorithm = "SHA256";
  private digits = 6;
  private userService: UserService;
  private emailService: EmailService;
  private tokenService: TokenService;

  constructor() {
    this.userService = new UserService();
    this.emailService = new EmailService();
    this.tokenService = new TokenService();
  }

  generate = async (
    req: Request,
    res: Response<OTPGenerateResponse>,
    next: NextFunction,
  ) => {
    try {
      const secret = await generateRandomBase32();

      const totp = new TOTP({
        issuer: this.otpIssuer,
        label: this.otpLabel,
        algorithm: this.algorithm,
        digits: this.digits,
        secret,
      });

      const url = totp.toString();

      await this.userService.setOTPSecret(req.user!.id, secret);

      return res.status(201).send({
        secret,
        url,
      });
    } catch (error) {
      return next(error);
    }
  };

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const userId = req.user!.id;
      const user = await this.userService.findFullById(userId);
      const err = new ValidationError([
        { message: ERROR_MESSAGES.validators.otp.error },
      ]);

      if (
        !user ||
        (user && (!user.otpSecret || !user.otpSecretIV || !user.otpAuthTag))
      ) {
        return next(err);
      }

      const secret = await decrypt(
        user.otpSecret!,
        user.otpSecretIV!,
        user.otpAuthTag!,
      );

      const totp = new TOTP({
        issuer: this.otpIssuer,
        label: this.otpLabel,
        algorithm: this.algorithm,
        digits: this.digits,
        secret,
      });

      const delta = totp.validate({ token });

      if (delta === null) {
        return next(err);
      }

      await this.userService.setOTPVerified(userId);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  validate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, token } = req.body;

      const user = await this.userService.findFullById(id);

      const err = new AuthenticationError();

      if (
        !user ||
        (user && (!user.otpSecret || !user.otpSecretIV || !user.otpAuthTag))
      ) {
        return next(err);
      }

      const secret = await decrypt(
        user.otpSecret!,
        user.otpSecretIV!,
        user.otpAuthTag!,
      );

      const totp = new TOTP({
        issuer: this.otpIssuer,
        label: this.otpLabel,
        algorithm: this.algorithm,
        digits: this.digits,
        secret,
      });

      const delta = totp.validate({ token, window: 1 });

      if (delta === null) {
        const failedLoginAttempts = user.failedLoginAttempts + 1;
        let newStatus: UserStatus = user.status;

        if (failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
          newStatus = UserStatus.LOCKED;
          await this.emailService.accountLocked(user.email);
        }

        await this.userService.loginAttemptUpdates(
          user.id,
          failedLoginAttempts,
          newStatus,
        );

        return next(err);
      }

      const userForResponse = await this.userService.loginAttemptUpdates(
        user.id,
        0,
        UserStatus.ENABLED,
      );

      await this.tokenService.generateAccessToken(userForResponse, res);
      await this.tokenService.generateRefreshToken(userForResponse, res);

      return res.status(200).send(userForResponse);
    } catch (error) {
      return next(error);
    }
  };

  disable = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.disableOTP(req.user!.id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
