const ERROR_MESSAGES = {
  server: {
    nodeCryptoMissing: "node:crypto is required but not available",
    environmentVariableMissing: "A required environment variable is missing",
  },
  generic: {
    internalServerError: "Internal server error",
    authenticationError: "Authentication error",
    forbiddenError: "Forbidden",
  },
  middleware: {
    unexpectedField: "Unexpected field",
    boundaryNotFound: "Boundary not found",
    somethingWentWrong: "Something went wrong",
    schemaValidator: "Error running schema validator",
    csrfExpired: "CSRF token expired",
  },
  utils: {
    hashingString: "Error hasing string",
    hashingPassword: "Error hasing password",
    verifyingPassword: "Error verifying password",
    signingToken: "Error singing token",
    verifyingToken: "Error verifying token",
  },
  validators: {
    email: {
      invalid: "Invalid email address",
    },
    password: {
      invalid: "Invalid password",
    },
    token: {
      invalid: "Invalid token",
      expired: "Expired token",
    },
    otp: {
      error: "Error verifying OTP",
    },
  },
  user: {
    notFound: "User not found",
  },
  profile: {
    notFound: "Profile not found",
    avatarNotFound: "Avatar not found",
  },
} as const;

export default ERROR_MESSAGES;
