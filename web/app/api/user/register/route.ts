import { z } from "zod";
import RegisterSchema from "@/app/lib/schema/register";
import { SecurityService } from "@/app/lib/service/security";
import { UserService } from "@/app/lib/service/user";
import { EmailService } from "@/app/lib/service/email";

export async function POST(request: Request) {
  const res = await request.json();

  const validatedFields = RegisterSchema.safeParse({
    name: res.name,
    email: res.email,
    password: res.password,
  });
  if (!validatedFields.success) {
    return Response.json(
      { errors: z.treeifyError(validatedFields.error) },
      { status: 400 }
    );
  }

  const hashedMail = SecurityService.deterministicHash(res.email);
  const encryptedMail = SecurityService.encrypt(res.email);
  const hashedPassword = await SecurityService.hash(res.password);

  const token = await UserService.create(
    res.name,
    hashedMail,
    encryptedMail,
    hashedPassword
  );

  if (!token) {
    return Response.json({
      status:
        "A link to activate your account has been emailed to the address provided. If you don't see it in your inbox, please contact the support.",
    });
  }

  await EmailService.sendVerifyRegister(res.email, res.name, token);

  return Response.json({
    status:
      "A link to activate your account has been emailed to the address provided. If you don't see it in your inbox, please contact the support.",
  });
}
