import { File } from "@prisma/client";

export const convertFileToBase64String = (file: File | null): string => {
  if (file === undefined || file === null) {
    return "";
  }

  const bufferToBase64 = file.buffer.toString("base64");

  const base64String = `data:${file.mimetype};base64,${bufferToBase64}`;

  return base64String;
};
