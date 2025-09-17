import { z } from "zod";

export default z.object({
  email: z
    .email({ message: "Please enter a valid email." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(16, { message: "Password must be at least 16 characters long." })
    .max(128, { message: "Password must be at most 128 characters long." })
    .trim(),
});
