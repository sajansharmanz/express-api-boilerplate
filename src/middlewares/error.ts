/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import multer from "multer";

import Logger from "../configs/logger";

import ERROR_MESSAGES from "../constants/errorMessages";

import { CustomError } from "../errors";
import { Prisma } from "@prisma/client";
import PRISMA_ERROR_CODES from "../constants/prismaErrorCodes";

const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  Logger.error(error.stack);

  if (error instanceof CustomError) {
    return res.status(error.statusCode).send({
      errors: error.serializeErrors(),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const recordType = (error.meta?.target as string[])[0] || "record";

    if (
      error.code === PRISMA_ERROR_CODES.OPERATION_FAILED_AS_RECORD_NOT_FOUND
    ) {
      return res.status(404).send({ message: `${recordType} not found` });
    }

    if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED) {
      return res.status(400).send({ message: `${recordType} already exists` });
    }

    if (error.code === PRISMA_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_FAILED) {
      return res.status(400).send({
        message: `A related record for ${recordType} was not found`,
      });
    }
  }

  if (error instanceof multer.MulterError) {
    if (error.message === "Unexpected field") {
      return res.status(400).send({
        errors: [
          {
            message: ERROR_MESSAGES.middleware.unexpectedField,
          },
        ],
      });
    }
  }

  if (error.message.includes("Boundary not found")) {
    return res.status(400).send({
      errors: [
        {
          message: ERROR_MESSAGES.middleware.boundaryNotFound,
        },
      ],
    });
  }

  return res.status(500).send({
    errors: [{ message: ERROR_MESSAGES.middleware.somethingWentWrong }],
  });
};

export default errorMiddleware;
