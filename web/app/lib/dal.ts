import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { UserService } from "./service/user";

export const validateSession = cache(async () => {
  const sessionCookie = (await cookies()).get("session")?.value;

  if (!sessionCookie) {
    redirect("/login");
  }

  const isSessionCookieValid = await UserService.validateSession(sessionCookie);

  if (isSessionCookieValid === undefined) {
    redirect("/login");
  }

  return isSessionCookieValid;
});
