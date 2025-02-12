"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store"; // Adjusted path based on your directory structure
import type { ReactNode } from "react";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
