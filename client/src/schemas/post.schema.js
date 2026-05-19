import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(300, "Title must be under 300 characters"),
  content: z.string().max(40000, "Content too long").optional(),
  imageUrl: z
    .string()
    .url("Must be a valid image URL")
    .optional()
    .or(z.literal("")),
  type: z.enum(["text", "image", "link"]).default("text"),
  communityId: z.string().min(1, "Please select a community"),
});
