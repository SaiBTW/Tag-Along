"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { setSession, useSession } from "@/lib/session";
import { buttonClass } from "./ui";

function Field({
  label,
  hint,
  ...input
}: { label: string; hint?: string } & React.ComponentProps<"input">) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      <input
        required
        className="h-11 rounded-xl border border-border bg-surface px-3 text-base font-normal outline-none focus:border-foreground"
        {...input}
      />
      {hint && <span className="font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const session = useSession();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const isSignup = mode === "signup";

  useEffect(() => {
    if (session) router.replace("/feed");
  }, [session, router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    setPending(true);
    setFailed(false);
    try {
      const auth = isSignup
        ? await api.signup({
            email: value("email"),
            password: value("password"),
            username: value("username"),
            displayName: value("displayName"),
          })
        : await api.login({ email: value("email"), password: value("password") });
      setSession(auth);
    } catch {
      setFailed(true);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        {isSignup ? "Create your account" : "Log in"}
      </h1>
      <p className="rounded-xl border border-border px-3 py-2 text-sm text-muted">
        Demo mode: any email and password work, and nothing is saved to a server yet.
      </p>

      {isSignup && (
        <>
          <Field label="Name" name="displayName" autoComplete="name" />
          <Field
            label="Username"
            name="username"
            autoComplete="username"
            hint="Friends find you by this."
          />
        </>
      )}
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field
        label="Password"
        name="password"
        type="password"
        minLength={isSignup ? 8 : undefined}
        autoComplete={isSignup ? "new-password" : "current-password"}
        hint={isSignup ? "At least 8 characters." : undefined}
      />

      {failed && (
        <p role="alert" className="text-sm text-accent">
          {isSignup
            ? "Couldn't create the account. Try again."
            : "Couldn't log you in. Check your email and password."}
        </p>
      )}

      <button type="submit" disabled={pending} className={buttonClass()}>
        {isSignup ? "Create account" : "Log in"}
      </button>

      <p className="text-center text-sm text-muted">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-medium text-foreground underline underline-offset-4"
        >
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
