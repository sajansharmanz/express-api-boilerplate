import { z } from "zod";

export class ProfileSchemas {
  update = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  });
}
