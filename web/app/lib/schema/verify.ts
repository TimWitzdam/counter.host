import { z } from "zod";

export default z.object({
  token: z
    .string()
    .min(6, { message: "Token must be exactly 6 charaters long." })
    .max(6, { message: "Token must be exactly 6 charaters long." })
    .trim(),
});
