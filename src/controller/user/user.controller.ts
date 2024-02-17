import { NextFunction, Response, Request } from "express";
import { UserStatus, TokenType } from "@prisma/client";
import * as jose from "jose";

import { EmailService, TokenService, UserService } from "../../service";

import {
  ForgotPasswordRequest,
  PasswordResetRequest,
  UpdateUserRequest,
  UserForResponse,
  UserLoginRequest,
  UserSignUpRequest,
  UserOTPEnabledLoginResponse,
} from "../../types";

import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from "../../errors";

import { verifyPassowrd } from "../../utils/password";
import { verifyToken } from "../../utils/tokens";

import { MAX_FAILED_LOGIN_ATTEMPTS } from "../../configs/environment";

import ERROR_MESSAGES from "../../constants/errorMessages";

export class UserController {
  private userService: UserService;
  private tokenService: TokenService;
  private emailService: EmailService;

  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.emailService = new EmailService();
  }

  signup = async (
    req: Request<never, never, UserSignUpRequest, never>,
    res: Response<UserForResponse>,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.createWithEmailAndPassword(
        email,
        password,
      );

      await this.tokenService.generateAccessToken(user, res);
      await this.tokenService.generateRefreshToken(user, res);

      await this.emailService.signUp(email);

      return res.status(201).send(user);
    } catch (error) {
      return next(error);
    }
  };

  login = async (
    req: Request<never, never, UserLoginRequest, never>,
    res: Response<UserForResponse | UserOTPEnabledLoginResponse>,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.findByEmail(email);

      if (!user) {
        return next(new AuthenticationError());
      }

      if (user.status !== UserStatus.ENABLED) {
        return next(new AuthenticationError());
      }

      if (user.otpEnabled) {
        return res.status(200).send({ id: user.id, otpEnabled: true });
      }

      if (!(await verifyPassowrd(password, user.password))) {
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

        return next(new AuthenticationError());
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

  logout = async (req: Request, res: Response<void>, next: NextFunction) => {
    try {
      const { refreshToken } = req.signedCookies;

      await this.tokenService.deleteToken(String(refreshToken));
      this.tokenService.clearCookies(res);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  logoutAll = async (req: Request, res: Response<void>, next: NextFunction) => {
    try {
      await this.tokenService.deleteAllRefreshTokens(req.user!.id);

      this.tokenService.clearCookies(res);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  forgotPassword = async (
    req: Request<never, never, ForgotPasswordRequest, never>,
    res: Response<void>,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;

      const token = await this.tokenService.generatePasswordResetToken(email);

      await this.emailService.forgotPassword(email, token);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  passwordReset = async (
    req: Request<never, never, PasswordResetRequest, never>,
    res: Response<void>,
    next: NextFunction,
  ) => {
    try {
      const { token, password } = req.body;

      const { email } = (await verifyToken(
        token,
        TokenType.PASSWORD_RESET,
      )) as { email: string };

      await this.userService.resetPassword(email, password);
      await this.tokenService.deleteToken(token);

      await this.emailService.passwordReset(email);

      return res.status(204).send();
    } catch (error) {
      if (error instanceof jose.errors.JWSInvalid) {
        return next(
          new ValidationError([
            {
              message: ERROR_MESSAGES.validators.token.invalid,
              field: "token",
            },
          ]),
        );
      }

      if (error instanceof jose.errors.JWTExpired) {
        return next(
          new ValidationError([
            {
              message: ERROR_MESSAGES.validators.token.expired,
              field: "token",
            },
          ]),
        );
      }

      return next(error);
    }
  };

  findMe = async (
    req: Request,
    res: Response<UserForResponse>,
    next: NextFunction,
  ) => {
    try {
      const user = await this.userService.findById(req.user!.id);

      if (!user) {
        return next(new NotFoundError(ERROR_MESSAGES.user.notFound));
      }

      return res.status(200).send(user);
    } catch (error) {
      return next(error);
    }
  };

  updateMe = async (
    req: Request<never, never, UpdateUserRequest, never>,
    res: Response<UserForResponse>,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.updateEmailAndPassword(
        req.user!.id,
        email,
        password,
      );

      return res.status(200).send(user);
    } catch (error) {
      return next(error);
    }
  };

  deleteMe = async (req: Request, res: Response<void>, next: NextFunction) => {
    try {
      await this.userService.deleteById(req.user!.id);

      this.tokenService.clearCookies(res);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
