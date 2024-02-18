import { PrismaClient, User, UserStatus } from "@prisma/client";

import { hashPassword } from "../../utils/password";

import { UserForResponse } from "../../types";

import { DEFAULT_USER_ROLE_NAME } from "../../constants/roles";
import { encrypt } from "../../utils/crypto";

const USER_FOR_RESPONSE = {
  id: true,
  email: true,
  status: true,
  otpEnabled: true,
  createdAt: true,
  updatedAt: true,
  roles: {
    select: {
      name: true,
      permissions: {
        select: {
          name: true,
        },
      },
    },
  },
};

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  createWithEmailAndPassword = async (
    email: string,
    password: string,
  ): Promise<UserForResponse> => {
    const hashedPasssowrd = await hashPassword(password.trim());

    const user = await this.prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPasssowrd,
        roles: {
          connect: [{ name: DEFAULT_USER_ROLE_NAME }],
        },
        profile: {
          create: {},
        },
      },
      select: USER_FOR_RESPONSE,
    });

    return user;
  };

  findByEmail = async (email: string): Promise<User | null> => {
    return await this.prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });
  };

  loginAttemptUpdates = async (
    userId: string,
    failedLoginAttempts: number,
    status: UserStatus,
  ): Promise<UserForResponse> => {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        failedLoginAttempts,
        status,
      },
      select: USER_FOR_RESPONSE,
    });
  };

  resetPassword = async (email: string, password: string) => {
    const hashedPasssowrd = await hashPassword(password.trim());

    await this.prisma.user.update({
      where: {
        email: email.toLowerCase().trim(),
      },
      data: {
        status: UserStatus.ENABLED,
        password: hashedPasssowrd,
      },
    });
  };

  findById = async (userId: string): Promise<UserForResponse | null> => {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: USER_FOR_RESPONSE,
    });
  };

  findFullById = async (userId: string): Promise<User | null> => {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  };

  updateEmailAndPassword = async (
    userId: string,
    email: string | undefined,
    password: string | undefined,
  ): Promise<UserForResponse> => {
    let data = {};

    if (email !== undefined && email !== null) {
      data = {
        ...data,
        email: email.toLowerCase().trim(),
      };
    }

    if (password !== undefined && password !== null) {
      const hashedPasssowrd = await hashPassword(password.trim());

      data = {
        ...data,
        password: hashedPasssowrd,
      };
    }

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: USER_FOR_RESPONSE,
    });
  };

  deleteById = async (userId: string) => {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  };

  setOTPSecret = async (userId: string, secret: string) => {
    const { content, iv, authTag } = await encrypt(secret);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        otpSecret: content,
        otpSecretIV: iv,
        otpAuthTag: authTag,
      },
    });
  };

  setOTPVerified = async (userId: string) => {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        otpEnabled: true,
        otpVerified: true,
      },
    });
  };

  disableOTP = async (userId: string) => {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        otpEnabled: false,
        otpVerified: false,
        otpSecret: null,
        otpSecretIV: null,
      },
    });
  };
}
