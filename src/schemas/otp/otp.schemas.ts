import { z } from "zod";

export class OTPSchemas {
  verify = z.object({
    token: z.string(),
  });

  validate = z.object({
    id: z.string(),
    token: z.string(),
  });
}
