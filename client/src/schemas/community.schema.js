import { z } from "zod";

export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(21, "Must be under 21 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  description: z.string().max(500, "Must be under 500 characters").optional(),
});
