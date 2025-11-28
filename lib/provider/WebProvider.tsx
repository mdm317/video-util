"use client";

import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type WebProviderProps = {
  children: ReactNode;
};
const client = new QueryClient();
export function WebProvider({ children }: WebProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
