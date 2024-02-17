const ROUTE_NAMES = {
  HEALTHCHECK: "/healthcheck",
  CSRF_TOKEN: "/csrftoken",
  SWAGGER: "/swagger",
  SIGN_UP: "/signup",
  LOGIN: "/login",
  LOGOUT: "/logout",
  LOGOUT_ALL: "/logoutall",
  FORGOT_PASSWORD: "/forgotpassword",
  PASSWORD_RESET: "/passwordreset",
  GET_ME: "/me",
  PATCH_ME: "/me",
  DELETE_ME: "/me",
  GET_PROFILE: "/profile",
  PATCH_PROFILE: "/profile",
  CREATE_AVATAR: "/profile/avatar",
  GET_AVATAR: "/profile/avatar",
  DELETE_AVATAR: "/profile/avatar",
  OTP_GENERATE: "/otp/generate",
  OTP_VERIFY: "/otp/verify",
  OTP_VALIDATE: "/otp/validate",
  OTP_DISABLE: "/otp/disable",
} as const;

export default ROUTE_NAMES;
