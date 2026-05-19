const { z } = require("zod");

const createCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "Community name must be at least 3 characters")
    .max(21, "Community name must be under 21 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional(),
});

module.exports = { createCommunitySchema };
