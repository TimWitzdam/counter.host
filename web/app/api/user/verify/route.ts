import { z } from "zod";
import VerifySchema from "@/app/lib/schema/verify";
import { UserService } from "@/app/lib/service/user";
import { EmailService } from "@/app/lib/service/email";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json();

  const validatedFields = VerifySchema.safeParse({
    token: res.token,
  });
  if (!validatedFields.success) {
    return Response.json(
      { errors: z.flattenError(validatedFields.error) },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return Response.json(
      {
        error: "Session not provided.",
      },
      { status: 401 }
    );
  }

  const userId = await UserService.verify(res.token, sessionCookie);

  if (!userId) {
    return Response.json(
      {
        error: "Token seems to be invalid. Please contact the support.",
      },
      { status: 401 }
    );
  }

  cookieStore.delete("awaiting_verify");

  const user = await UserService.getUser(userId);

  if (!user) {
    return Response.json(
      {
        error: "Token seems to be invalid. Please contact the support.",
      },
      { status: 401 }
    );
  }

  await EmailService.sendConfirmRegister(user.email, user.name);

  return Response.json({
    status: "ok",
  });
}
