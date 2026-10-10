"use client";

import { useEffect, useState } from "react";

type State<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error" };

// Runs `load` on mount and whenever its identity changes, so pass a stable function.
export function useApi<T>(load: () => Promise<T>): State<T> {
  const [state, setState] = useState<State<T>>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    load().then(
      (data) => {
        if (!cancelled) setState({ status: "ready", data });
      },
      () => {
        if (!cancelled) setState({ status: "error" });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [load]);

  return state;
}
