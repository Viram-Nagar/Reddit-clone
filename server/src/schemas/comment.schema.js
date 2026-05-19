const { z } = require("zod");

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(10000, "Comment is too long"),
});

module.exports = { createCommentSchema };
