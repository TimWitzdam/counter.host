import { z } from "zod";

export default z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z
    .email({ message: "Please enter a valid email." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(16, { message: "Be at least 16 characters long" })
    .max(128, { message: "Be at most 128 characters long" })
    .trim(),
});
