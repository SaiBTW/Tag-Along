import Link from "next/link";
import type { ComponentProps } from "react";
import type { PublicUser, ResponseStatus } from "@/lib/api";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="text-lg font-semibold tracking-tight">
      Tag Along
    </Link>
  );
}

const buttonStyles = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  secondary: "border border-border bg-surface hover:bg-background",
};

export function buttonClass(variant: keyof typeof buttonStyles = "primary") {
  return `inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition disabled:opacity-60 ${buttonStyles[variant]}`;
}

export function Avatar({ user, size = "md" }: { user?: PublicUser; size?: "sm" | "md" }) {
  const initials = (user?.displayName ?? "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const box = size === "sm" ? "size-8 text-xs" : "size-10 text-sm";
  return (
    <span
      aria-hidden
      className={`${box} inline-flex shrink-0 items-center justify-center rounded-full bg-foreground/10 font-medium`}
    >
      {initials}
    </span>
  );
}

const responseLabels: Record<ResponseStatus, string> = {
  GOING: "Going",
  MAYBE: "Maybe",
  CANT: "Can't",
  ARRIVED: "Arrived",
};

const responseColors: Record<ResponseStatus, string> = {
  GOING: "text-going",
  MAYBE: "text-maybe",
  CANT: "text-muted",
  ARRIVED: "text-accent",
};

export function ResponseLabel({ status }: { status: ResponseStatus }) {
  return (
    <span className={`text-sm font-medium ${responseColors[status]}`}>
      {responseLabels[status]}
    </span>
  );
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-4 ${className}`}
      {...props}
    />
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-semibold tracking-tight">{children}</h1>;
}

export function Notice({ children }: { children: React.ReactNode }) {
  return <p className="py-10 text-center text-sm text-muted">{children}</p>;
}
