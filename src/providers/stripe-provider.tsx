// src/components/providers/stripe-provider.tsx
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function StripeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Elements stripe={getStripe()}>
      {" "}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Elements>
  );
}
