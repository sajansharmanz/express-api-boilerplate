import { Profile } from "@prisma/client";
import z from "zod";
import { ProfileSchemas } from "../../schemas";

const profileSchemas = new ProfileSchemas();

export type ProfileForResponse = Omit<Profile, "userId">;

export type UpdateProfileRequest = z.infer<typeof profileSchemas.update>;
