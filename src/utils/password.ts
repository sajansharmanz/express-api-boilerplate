import * as bcryptjs from "bcryptjs";

// Errors
import { InternalServerError } from "../errors";

// Consts
import ERROR_MESSAGES from "../constants/errorMessages";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcryptjs.hash(password, 8);
  } catch (error) {
    throw new InternalServerError(ERROR_MESSAGES.utils.hashingPassword);
  }
};

export const verifyPassowrd = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcryptjs.compare(password, hashedPassword);
  } catch (error) {
    throw new InternalServerError(ERROR_MESSAGES.utils.verifyingPassword);
  }
};
