"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { setSession, useSession } from "@/lib/session";
import { Brand, buttonClass } from "./ui";

const tabs = [
  { href: "/feed", label: "Feed" },
  { href: "/friends", label: "Friends" },
  { href: "/groups", label: "Groups" },
];

// Reads the pathname, which is only known per request on dynamic routes, so
// every use sits inside <Suspense>.
function Tabs({ className }: { className: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className={className}>
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 items-center justify-center px-3 py-3 text-sm font-medium sm:flex-none sm:py-2 ${
              active ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

// Client-side gate for the signed-in area. The backend enforces access; this
// only decides which screen to show.
export function AppShell({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) router.replace("/login");
  }, [session, router]);

  // Children stay mounted (but hidden) while signed out so Next.js can still
  // prerender and validate the page segments.
  return (
    <div hidden={!session} className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center gap-4 px-4">
          <Brand href="/feed" />
          <Suspense>
            <Tabs className="hidden sm:flex" />
          </Suspense>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSession(null)}
              className="text-sm text-muted hover:text-foreground"
            >
              Log out
            </button>
            <Link href="/posts/new" className={`${buttonClass()} h-9 px-4`}>
              New post
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-24 pt-6 sm:pb-10">{children}</main>
      <Suspense>
        <Tabs className="fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-surface sm:hidden" />
      </Suspense>
    </div>
  );
}
