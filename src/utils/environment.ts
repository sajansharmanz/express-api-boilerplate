import { ENV } from "../configs/environment";

export const isDevelopment = () => ENV === "development";
export const isTest = () => ENV === "test";
export const isProduction = () => ENV === "production";
