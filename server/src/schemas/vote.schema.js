const { z } = require("zod");

const voteSchema = z.object({
  type: z.enum(["UP", "DOWN"], {
    errorMap: () => ({ message: "Vote type must be UP or DOWN" }),
  }),
});

module.exports = { voteSchema };
