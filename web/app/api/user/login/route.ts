import { z } from "zod";
import LoginSchema from "@/app/lib/schema/login";
import { SecurityService } from "@/app/lib/service/security";
import { UserService } from "@/app/lib/service/user";
import { EmailService } from "@/app/lib/service/email";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json();

  const validatedFields = LoginSchema.safeParse({
    email: res.email,
    password: res.password,
  });
  if (!validatedFields.success) {
    return Response.json(
      { errors: z.flattenError(validatedFields.error) },
      { status: 400 }
    );
  }

  const authenticateResult = await UserService.authenticate(
    res.email,
    res.password
  );

  if (!authenticateResult) {
    return Response.json(
      {
        error: "Login failed; Invalid email or password.",
      },
      {
        status: 401,
      }
    );
  }

  const [userId, verified] = authenticateResult;

  const sessionCookie = await UserService.newSession(userId);

  if (!sessionCookie) {
    return Response.json(
      {
        error: "Login failed; Invalid email or password.",
      },
      {
        status: 401,
      }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("session", sessionCookie);
  if (!verified) {
    cookieStore.set("awaiting_verify", "true");
    return Response.json(
      {
        error:
          "Your account is not verified yet. Please check your inbox for a verification token or contact the support.",
      },
      {
        status: 403,
      }
    );
  }

  return Response.json({
    status: "ok",
  });
}
