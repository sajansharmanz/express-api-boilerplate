/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

import { IValidationError } from "../types/errors/errors.types";

import { InternalServerError, ValidationError } from "../errors";
import ERROR_MESSAGES from "../constants/errorMessages";

export const VALIDATION_AREA = {
  BODY: "BODY",
  CONTENT_TYPE: "CONTENT_TYPE",
  FILE: "FILE",
} as const;

type ValidationArea = (typeof VALIDATION_AREA)[keyof typeof VALIDATION_AREA];

const schemaValidator = (
  schema: z.ZodObject<any, any> | z.ZodEffects<z.ZodString, any, any>,
  area: ValidationArea = VALIDATION_AREA.BODY,
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      switch (area) {
        case VALIDATION_AREA.CONTENT_TYPE:
          schema.parse(req.get("Content-Type"));
          break;
        case VALIDATION_AREA.FILE:
          // eslint-disable-next-line no-case-declarations
          const { mimetype } = req.file as Express.Multer.File;
          schema.parse(mimetype);
          break;
        case VALIDATION_AREA.BODY:
        default:
          schema.parse(req.body);
          break;
      }

      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorsMessages: IValidationError[] = error.errors.map(
          (issue: z.ZodIssue) => ({
            message: issue.message,
            field: issue.path.join("."),
          }),
        );

        return next(new ValidationError(errorsMessages));
      }

      return next(
        new InternalServerError(ERROR_MESSAGES.middleware.schemaValidator),
      );
    }
  };
};

export default schemaValidator;
