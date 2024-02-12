import { NextFunction, Response, Request } from "express";

import { AuthenticationError } from "../errors";

const canAccess = (...permissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const usersPermissions: string[] = [];

    req.user!.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        usersPermissions.push(permission.name);
      });
    });

    if (
      !permissions.every((permission) => usersPermissions.includes(permission))
    ) {
      return next(new AuthenticationError());
    }

    return next();
  };
};

export default canAccess;
