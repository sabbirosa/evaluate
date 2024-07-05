import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "Evaluate Sabbir!",
  description:
    "Please provide your feedback on your experience of work with Sabbir. Your insights are valuable and help me to improve. Please include details about the specific project, club, or mentorship you were involved in, and how you came to know me.",
};

const fontHeading = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: "700",
});

const fontBody = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
