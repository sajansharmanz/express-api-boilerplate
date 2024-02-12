import { PrismaClient, File } from "@prisma/client";
import { ProfileForResponse } from "../../types";

const PROFILE_FOR_RESPONSE = {
  id: true,
  firstName: true,
  lastName: true,
  createdAt: true,
  updatedAt: true,
};

export class ProfileService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  findByUserId = async (userId: string): Promise<ProfileForResponse | null> => {
    return await this.prisma.profile.findUnique({
      where: {
        userId,
      },
      select: PROFILE_FOR_RESPONSE,
    });
  };

  updateByUserId = async (
    userId: string,
    firstName: string | undefined,
    lastName: string | undefined,
  ): Promise<ProfileForResponse> => {
    let data = {};

    if (firstName !== undefined) {
      data = {
        ...data,
        firstName,
      };
    }

    if (lastName !== undefined) {
      data = {
        ...data,
        lastName,
      };
    }

    return await this.prisma.profile.update({
      where: {
        userId,
      },
      data: {
        ...data,
      },
      select: PROFILE_FOR_RESPONSE,
    });
  };

  createAvatarByUserId = async (
    userId: string,
    originalname: string,
    mimetype: string,
    size: number,
    buffer: Buffer,
  ): Promise<File> => {
    await this.prisma.file.deleteMany({
      where: {
        profile: {
          userId,
        },
      },
    });

    return await this.prisma.file.create({
      data: {
        originalname,
        mimetype,
        size,
        buffer,
        profile: {
          connectOrCreate: {
            where: {
              userId,
            },
            create: {
              userId,
            },
          },
        },
      },
    });
  };

  findAvatarByUserId = async (userId: string): Promise<File | null> => {
    return await this.prisma.file.findFirst({
      where: {
        profile: {
          userId,
        },
      },
    });
  };

  deleteAvatarByUserId = async (userId: string): Promise<void> => {
    await this.prisma.file.deleteMany({
      where: {
        profile: {
          userId,
        },
      },
    });
  };
}
