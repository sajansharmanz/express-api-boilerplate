import { z } from "zod";
import isStrongPassword from "validator/lib/isStrongPassword";

import ERROR_MESSAGES from "../../constants/errorMessages";

const passwordValidator = z
  .string()
  .refine((value) => isStrongPassword(value, { minLength: 8 }), {
    message: ERROR_MESSAGES.validators.password.invalid,
  });

const emailValidator = z
  .string()
  .email({ message: ERROR_MESSAGES.validators.email.invalid });

export class UserSchemas {
  signUp = z.object({
    email: emailValidator,
    password: passwordValidator,
  });

  login = this.signUp;

  forgotPassword = z.object({ email: emailValidator, csrf: z.string() });

  passwordReset = z.object({
    token: z.string(),
    password: passwordValidator,
  });

  updateMe = z.object({
    email: emailValidator.optional(),
    password: passwordValidator.optional(),
  });
}
