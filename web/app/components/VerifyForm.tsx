"use client";

import { useState } from "react";
import BaseInput from "../components/BaseInput";
import PrimaryButton from "../components/PrimaryButton";
import InformationIcon from "@/public/icons/Information.svg";
import { useRouter } from "next/navigation";
import RoundedCheckmark from "@/public/icons/RoundedCheckmark.svg";

export default function VerifyForm() {
  const [errors, setErrors] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: form.get("token"),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.replace("/app");
        }, 2000);
      } else {
        const json = await res.json().catch(() => null);
        if (json && json.errors) {
          const messages: string[] = [];
          for (const key of Object.keys(json.errors.fieldErrors)) {
            const arr = json.errors.fieldErrors[key];
            if (Array.isArray(arr)) messages.push(...arr);
          }
          setErrors(messages);
        } else if (json && json.error) {
          setErrors([json.error]);
        } else {
          setErrors(["Unexpected error occurred. Please contact the support."]);
        }
      }
    } catch (err) {
      setErrors(["Unexpected error occurred. Please contact the support."]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4 items-center justify-center mt-6"
    >
      <BaseInput id="token" name="token" placeholder="Token" />
      {errors &&
        errors.map((err, i) => (
          <div key={i} className="flex items-center gap-2 self-start">
            <InformationIcon />
            <p className="text-xs text-red-500">{err}</p>
          </div>
        ))}
      <PrimaryButton className="w-full" disabled={loading} loading={loading}>
        {success ? (
          <div className="flex items-center gap-2">
            <RoundedCheckmark />
            <p>Success. Redirecting to app...</p>
          </div>
        ) : (
          "Continue"
        )}
      </PrimaryButton>
      <p className="text-xs text-gray self-start">
        If you did not receive an email with a token, please{" "}
        <a href="/support" target="_blank" className="text-blue-500">
          contact the support
        </a>
        .
      </p>
    </form>
  );
}
