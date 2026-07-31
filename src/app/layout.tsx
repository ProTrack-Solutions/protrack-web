import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import StripeProvider from "@/providers/stripe-provider";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ProTrack",
  icons: {
    icon: "logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn("font-sans overflow-auto", geist.variable)}
    >
      <body>
        <Toaster theme="light" richColors closeButton position="top-right" />
        <StripeProvider>{children}</StripeProvider>
      </body>
    </html>
  );
}
