"use client"
import { QueryClient, QueryClientProvider } from  "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import React, { useState } from "react"

import { trpc } from "./client"
import superjson from "superjson";

export default function Provider({ children } : { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc",
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
