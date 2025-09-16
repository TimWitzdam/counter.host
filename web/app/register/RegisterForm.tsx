"use client";

import { useState } from "react";
import BaseInput from "../components/BaseInput";
import PrimaryButton from "../components/PrimaryButton";
import InformationIcon from "@/public/icons/Information.svg";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [errors, setErrors] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      if (res.ok) {
        document.cookie = "awaiting_verify=true";
        router.refresh();
      } else {
        const json = await res.json().catch(() => null);
        if (json && json.errors) {
          const messages: string[] = [];
          for (const key of Object.keys(json.errors.fieldErrors)) {
            const arr = json.errors.fieldErrors[key];
            messages.push(...arr);
          }
          setErrors(messages);
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
      <BaseInput
        id="name"
        name="name"
        placeholder="Name"
        autoComplete="username"
      />
      <BaseInput
        id="email"
        name="email"
        placeholder="Email"
        type="email"
        autoComplete="email"
      />
      <BaseInput
        id="password"
        name="password"
        placeholder="Password (min. 16 characters)"
        type="password"
        autoComplete="new-password"
      />
      <p className="text-xs text-gray self-start">
        By continuing you agree to our{" "}
        <a href="/tos" target="_blank" className="text-blue-500">
          terms of service
        </a>
        .
      </p>
      {errors &&
        errors.map((err, i) => (
          <div key={i} className="flex items-center gap-2 self-start">
            <InformationIcon />
            <p className="text-xs text-red-500">{err}</p>
          </div>
        ))}
      <PrimaryButton
        className="w-full mt-6"
        disabled={loading}
        loading={loading}
      >
        Continue
      </PrimaryButton>
    </form>
  );
}
