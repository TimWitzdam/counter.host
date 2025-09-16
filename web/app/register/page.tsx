import SecondaryButton from "../components/SecondaryButton";
import VerifyForm from "../components/VerifyForm";
import RegisterForm from "./RegisterForm";
import { cookies } from "next/headers";

export default async function Register() {
  const cookieStore = await cookies();
  const awaitingVerifyCookie = cookieStore.get("awaiting_verify");

  return (
    <div>
      <section className="relative h-screen">
        <div className="flex items-center justify-between p-4">
          <span className="text-xl font-medium">counter.host</span>
          <SecondaryButton>Login</SecondaryButton>
        </div>
        <div className="absolute h-full w-full top-0 left-0 flex flex-col gap-4 items-center justify-center px-4">
          <h1 className="text-3xl font-medium text-center">
            {awaitingVerifyCookie ? "Verify your Email" : "Register"}
          </h1>
          {awaitingVerifyCookie && (
            <p className="text-center text-gray">
              Check your inbox for an email with a verification token
            </p>
          )}
          {awaitingVerifyCookie ? <VerifyForm /> : <RegisterForm />}
        </div>
      </section>
    </div>
  );
}
