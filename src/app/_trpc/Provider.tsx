"use client"
import { QueryClient, QueryClientProvider } from  "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import React, { useState } from "react"

import { trpc } from "./client"
import superjson from "superjson";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.HOST_URL) return `https://${process.env.HOST_URL}`; // SSR should use host url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default function Provider({ children } : { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson
    })
  );

  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
