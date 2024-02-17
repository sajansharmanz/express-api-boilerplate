import { z } from "zod";
import { User } from "@prisma/client";

import { UserSchemas } from "../../schemas";

const userSchemas = new UserSchemas();

export type UserSignUpRequest = z.infer<typeof userSchemas.signUp>;
export type UserLoginRequest = z.infer<typeof userSchemas.login>;
export type ForgotPasswordRequest = z.infer<typeof userSchemas.forgotPassword>;
export type PasswordResetRequest = z.infer<typeof userSchemas.passwordReset>;
export type UpdateUserRequest = z.infer<typeof userSchemas.updateMe>;

export type UserForResponse = Omit<
  User,
  | "password"
  | "passwordResetToken"
  | "failedLoginAttempts"
  | "otpVerified"
  | "otpSecret"
  | "otpAuthURL"
> & {
  roles: {
    name: string;
    permissions: {
      name: string;
    }[];
  }[];
};

export type UserOTPEnabledLoginResponse = Pick<User, "id" | "otpEnabled">;
