import { Prisma, PrismaClient } from "@prisma/client";

import PERMISSIONS from "../src/constants/permissions";
import DEFAULT_ROLES, { ADMIN_USER_ROLE_NAME } from "../src/constants/roles";

import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
} from "../src/configs/environment";

import { hashPassword } from "../src/utils/password";

import { UserSchemas } from "../src/schemas";
import Logger from "../src/configs/logger";

const prisma = new PrismaClient();

/**
 * Have to use the following funciton due to timing issues
 * Async/Await does not fix issue
 */

const seed = (action: () => void, callback?: () => void): void => {
  action();

  if (callback) {
    setTimeout(() => callback(), 1500);
  }
};

const seedPermissions = () => {
  Object.values(PERMISSIONS).forEach(async (p) => {
    const data: Prisma.PermissionCreateInput = {
      name: p,
      description: `Allow user to ${p.split("_").join(" ").toLowerCase()}`,
    };

    await prisma.permission.upsert({
      where: {
        name: data.name,
      },
      create: data,
      update: data,
    });
  });
};

const seedRoles = () => {
  DEFAULT_ROLES.forEach(async (r) => {
    await prisma.role.upsert({
      where: {
        name: r.name,
      },
      create: r,
      update: r,
    });
  });
};

const seedDefaultUser = () => {
  const userSchemas = new UserSchemas();

  userSchemas.signUp.parse({
    email: DEFAULT_ADMIN_EMAIL,
    password: DEFAULT_ADMIN_PASSWORD,
  });

  const email = DEFAULT_ADMIN_EMAIL as string;
  const password = DEFAULT_ADMIN_PASSWORD as string;

  (async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const hashedPassword = await hashPassword(password.trim());

    await prisma.user.upsert({
      where: {
        email: trimmedEmail,
      },
      create: {
        email: trimmedEmail,
        password: hashedPassword,
        roles: {
          connect: {
            name: ADMIN_USER_ROLE_NAME,
          },
        },
        profile: {
          create: {},
        },
      },
      update: {
        email: trimmedEmail,
        password: hashedPassword,
        roles: {
          connect: {
            name: ADMIN_USER_ROLE_NAME,
          },
        },
      },
    });
  })();
};

const main = async () => {
  seed(seedPermissions, () => seed(seedRoles, () => seedDefaultUser()));
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    Logger.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
