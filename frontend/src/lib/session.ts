"use client";

import { useSyncExternalStore } from "react";
import type { AuthResponse } from "@/lib/api";

const KEY = "tagalong.session";

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedSession: AuthResponse | null = null;

function read(): AuthResponse | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // Storage blocked: treat as logged out.
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedSession = raw ? (JSON.parse(raw) as AuthResponse) : null;
    } catch {
      cachedSession = null;
    }
  }
  return cachedSession;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function setSession(session: AuthResponse | null) {
  try {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the session won't survive a reload.
  }
  listeners.forEach((notify) => notify());
}

// `undefined` until the browser has read storage, then the session or `null`.
export function useSession(): AuthResponse | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}
