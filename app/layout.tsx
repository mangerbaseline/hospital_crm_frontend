import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReduxProvider from "@/components/providers/ReduxProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "RF Health CRM",
  description: "RF Health CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}
