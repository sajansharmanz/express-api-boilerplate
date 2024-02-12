import { z } from "zod";

export class FileSchemas {
  private allowedContentType = "multipart/form-data";
  private allowedImageTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
  ];

  contentType = z
    .string()
    .refine((value) => value.includes(this.allowedContentType));

  imageType = z
    .string()
    .refine((value) => this.allowedImageTypes.includes(value));
}
